const formidable = require('formidable');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { extractDataFromPDF } = require('../models/billModel');

exports.handleUpload = (req) => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '..', 'uploads');
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(new Error('Error parsing the files'));
            }

            const fileKey = Object.keys(files)[0];
            const file = files[fileKey][0];
            if (!file) {
                return reject(new Error('No file uploaded'));
            }

            const filepath = file.filepath;

            try {
                const data = await extractDataFromPDF(filepath);
                await prisma.bill.create({ data });
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    });
};
