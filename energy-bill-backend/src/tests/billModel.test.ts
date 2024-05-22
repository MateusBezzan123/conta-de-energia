import fs from 'fs';
import pdfParse, { Result, Version } from 'pdf-parse';
import path from 'path';
import extractDataFromPDF from '../models/billModel';

jest.mock('fs');
jest.mock('pdf-parse');

describe('extractDataFromPDF', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const mockedPdfParse = pdfParse as jest.MockedFunction<typeof pdfParse>;

  beforeAll(() => {
    mockedFs.readFileSync.mockImplementation((filePath: fs.PathLike | number) => {
      if (typeof filePath === 'string' && filePath.includes('valid.pdf')) {
        return Buffer.from('Nº DO CLIENTE\n7202788969\nReferente a\nJAN/2023\nEnergia Elétrica kWh 100 50,00\nEnergia SCEE ISENTA kWh 200 100,00\nEnergia compensada GD I kWh 300 150,00\nContrib Ilum Publica Municipal 10,00\n');
      } else if (typeof filePath === 'string' && filePath.includes('invalid.pdf')) {
        return Buffer.from('Invalid PDF Content');
      }
      throw new Error('ENOENT: no such file or directory');
    });

    mockedPdfParse.mockImplementation(async (dataBuffer: Buffer) => {
      if (dataBuffer.toString().includes('Invalid PDF Content')) {
        return {
          text: 'Invalid PDF Content',
          numpages: 1,
          numrender: 1,
          info: {},
          metadata: null,
          version: '1.0.0' as Version
        };
      }
      return {
        text: dataBuffer.toString(),
        numpages: 1,
        numrender: 1,
        info: {},
        metadata: null,
        version: '1.0.0' as Version
      };
    });
  });

  it('should extract data correctly from a valid PDF', async () => {
    const filepath = path.join(__dirname, 'valid.pdf');
    const data = await extractDataFromPDF(filepath);

    expect(data.clientNumber).toBe('7202788969');
    expect(data.referenceMonth).toBe('JAN/2023');
    expect(data.energyElectricQuantity).toBe(100);
    expect(data.energyElectricValue).toBe(50.00);
    expect(data.energySCEEEQuantity).toBe(200);
    expect(data.energySCEEEValue).toBe(100.00);
    expect(data.energyCompensatedQuantity).toBe(300);
    expect(data.energyCompensatedValue).toBe(150.00);
    expect(data.publicLightingContribution).toBe(10.00);
  });
});
