import fs from 'fs';
import pdfParse from 'pdf-parse';

interface ExtractedData {
    clientNumber: string;
    referenceMonth: string;
    energyElectricQuantity?: number;
    energyElectricValue?: number;
    energySCEEEQuantity?: number;
    energySCEEEValue?: number;
    energyCompensatedQuantity?: number;
    energyCompensatedValue?: number;
    publicLightingContribution?: number;
    filePath?: string;
}

const extractDataFromPDF = async (filepath: string): Promise<ExtractedData> => {
    const dataBuffer = fs.readFileSync(filepath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    const findLineAndValue = (text: string, keyword: string): string | null => {
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
    const energyCompensatedValueRegex = /Energia\s*compensada\s*GD\s*I\s*kWh\s*\d+\s*([\d,-]+)/i;

    const extractField = (regex: RegExp, text: string): string | null => {
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

    if (clientNumber === null || referenceMonth === null) {
        throw new Error('Required fields are missing.');
    }

    return {
        clientNumber: clientNumber.trim(),
        referenceMonth: referenceMonth.trim(),
        energyElectricQuantity: energyElectricQuantity ? parseInt(energyElectricQuantity) : undefined,
        energyElectricValue: energyElectricValue ? parseFloat(energyElectricValue.replace(',', '.')) : undefined,
        energySCEEEQuantity: energySCEEEQuantity ? parseInt(energySCEEEQuantity) : undefined,
        energySCEEEValue: energySCEEEValue ? parseFloat(energySCEEEValue.replace(',', '.')) : undefined,
        energyCompensatedQuantity: energyCompensatedQuantity ? parseInt(energyCompensatedQuantity) : undefined,
        energyCompensatedValue: energyCompensatedValue ? parseFloat(energyCompensatedValue.replace(',', '.')) : undefined,
        publicLightingContribution: publicLightingContribution ? parseFloat(publicLightingContribution.replace(',', '.')) : undefined,
        filePath: filepath
    };
};

export default extractDataFromPDF;
