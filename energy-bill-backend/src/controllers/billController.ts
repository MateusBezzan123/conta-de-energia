import { Request, Response } from 'express';
import billService from '../services/billService';
import path from 'path';
import fs from 'fs';

export const uploadBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await billService.handleUpload(req);
        res.json({ message: 'Data saved successfully', data });
    } catch (err: any) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getBills = async (req: Request, res: Response): Promise<void> => {
    try {
        const bills = await billService.getAllBills();
        res.json(bills);
    } catch (err: any) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getBillById = async (req: Request, res: Response): Promise<void> => {
    try {
        const bill = await billService.getBillById(req.params.id);
        if (bill) {
            res.json(bill);
        } else {
            res.status(404).json({ message: 'Bill not found' });
        }
    } catch (err: any) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const downloadBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const bill = await billService.getBillById(req.params.id);
        if (bill && bill.filePath) {
            const filePath = path.isAbsolute(bill.filePath) ? bill.filePath : path.join(__dirname, '..', bill.filePath);
            console.log(`Attempting to download file from path: ${filePath}`); 
            if (fs.existsSync(filePath)) {
                res.download(filePath);
            } else {
                console.error(`File not found at path: ${filePath}`);                 
                res.status(404).json({ message: 'File not found' });
            }
        } else {
            res.status(404).json({ message: 'Bill not found' });
        }
    } catch (err: any) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};
