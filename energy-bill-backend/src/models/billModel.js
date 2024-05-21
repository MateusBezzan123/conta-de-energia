const fs = require('fs');
const pdfParse = require('pdf-parse');

exports.extractDataFromPDF = async (filepath) => {
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
};
