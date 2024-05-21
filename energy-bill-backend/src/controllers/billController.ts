import { Request, Response } from 'express';
import billService from '../services/billService';
import path from 'path';

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
        if (bill) {
            const filePath = path.join(__dirname, '..', 'uploads', `${bill.id}.pdf`);
            res.download(filePath);
        } else {
            res.status(404).json({ message: 'Bill not found' });
        }
    } catch (err: any) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};