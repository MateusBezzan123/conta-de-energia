const express = require('express');
const formidable = require('formidable');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'uploads');
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing the files:', err);
            return res.status(500).json({ error: 'Error parsing the files' });
        }

        console.log('Files received:', files);

        const fileKey = Object.keys(files)[0];
        const file = files[fileKey][0];         
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filepath = file.filepath;

        extractDataFromPDF(filepath)
            .then(data => {
                prisma.bill.create({ data })
                    .then(() => res.json({ message: 'Data saved successfully', data }))
                    .catch(err => {
                        console.error('Error saving data to database:', err);
                        res.status(500).json({ error: 'Error saving data to database', details: err });
                    });
            })
            .catch(err => {
                console.error('Error extracting data from PDF:', err);
                res.status(500).json({ error: err.message });
            });
    });
});

async function extractDataFromPDF(filepath) {
    const dataBuffer = fs.readFileSync(filepath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    const findLineAndValue = (text, keyword) => {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(keyword)) {
                const valueLine = lines[i + 1];
                if (valueLine) {
                    const firstField = valueLine.trim().split(/\s+/)[0];
                    return firstField;
                }
            }
        }
        return null;
    };

    const clientNumber = findLineAndValue(text, 'Nº DO CLIENTE');
    const referenceMonth = findLineAndValue(text, 'Referente a');

    const energyElectricValueRegex = /Energia\s*Elétrica\s*kWh\s*\d+\s*([\d,]+)/i;
    const energySCEEEValueRegex = /Energia\s*SCEE\s*ISENTA\s*kWh\s*\d+\s*([\d,]+)/i;
    const energyCompensatedValueRegex = /Energia\s*compensada\s*GD\s*I\s*kWh\s*\d+\s*([\-\d,]+)/i;

    const extractField = (regex, text) => {
        const match = regex.exec(text);
        return match ? match[1].trim() : null;
    };

    const energyElectricValue = extractField(energyElectricValueRegex, text);
    const energySCEEEValue = extractField(energySCEEEValueRegex, text);
    const energyCompensatedValue = extractField(energyCompensatedValueRegex, text);

    const energyElectricQuantityRegex = /Energia\s*Elétrica\s*kWh\s*(\d+)/i;
    const energySCEEEQuantityRegex = /Energia\s*SCEE\s*ISENTA\s*kWh\s*(\d+)/i;
    const energyCompensatedQuantityRegex = /Energia\s*compensada\s*GD\s*I\s*kWh\s*(\d+)/i;
    const publicLightingContributionRegex = /Contrib\s*Ilum\s*Publica\s*Municipal\s*([\d,]+)/i;

    const energyElectricQuantity = extractField(energyElectricQuantityRegex, text);
    const energySCEEEQuantity = extractField(energySCEEEQuantityRegex, text);
    const energyCompensatedQuantity = extractField(energyCompensatedQuantityRegex, text);
    const publicLightingContribution = extractField(publicLightingContributionRegex, text);

    const result = {
        clientNumber: clientNumber ? clientNumber.trim() : null,
        referenceMonth: referenceMonth ? referenceMonth.trim() : null,
        energyElectricQuantity: energyElectricQuantity ? parseInt(energyElectricQuantity) : null,
        energyElectricValue: energyElectricValue ? parseFloat(energyElectricValue.replace(',', '.')) : null,
        energySCEEEQuantity: energySCEEEQuantity ? parseInt(energySCEEEQuantity) : null,
        energySCEEEValue: energySCEEEValue ? parseFloat(energySCEEEValue.replace(',', '.')) : null,
        energyCompensatedQuantity: energyCompensatedQuantity ? parseInt(energyCompensatedQuantity) : null,
        energyCompensatedValue: energyCompensatedValue ? parseFloat(energyCompensatedValue.replace(',', '.')) : null,
        publicLightingContribution: publicLightingContribution ? parseFloat(publicLightingContribution.replace(',', '.')) : null
    };

    if (
        result.clientNumber === null ||
        result.referenceMonth === null ||
        result.energyElectricValue === null ||
        result.energySCEEEValue === null ||
        result.energyCompensatedValue === null
    ) {
        throw new Error('Required fields are missing.');
    }
    return result;
}

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT});')
});
