import { IncomingForm, File as FormidableFile, Files } from 'formidable';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';  // Import the uuid library
import { extractDataFromPDF } from '../models/billModel';

const prisma = new PrismaClient();

interface UploadedFile extends FormidableFile {
    filepath: string;
}

const handleUpload = (req: Request): Promise<any> => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm({
            uploadDir: path.join(__dirname, '..', 'uploads'),
            keepExtensions: true
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(new Error('Error parsing the files'));
            }

            const fileKey = Object.keys(files)[0];
            const file = Array.isArray(files[fileKey]) ? (files[fileKey] as FormidableFile[])[0] : files[fileKey];
            
            if (!file) {
                return reject(new Error('No file uploaded'));
            }

            const uploadedFile = file as UploadedFile;
            const filepath = uploadedFile.filepath;

            try {
                const data = await extractDataFromPDF(filepath);
                const billData = {
                    ...data,
                    id: uuidv4()
                };
                await prisma.bill.create({ data: billData });
                resolve(billData);
            } catch (err) {
                reject(err);
            }
        });
    });
};

export default {
    handleUpload
};
