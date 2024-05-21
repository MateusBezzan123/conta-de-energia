import { Request, Response } from 'express';
import billService from '../services/billService';

export const uploadBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await billService.handleUpload(req);
        res.json({ message: 'Data saved successfully', data });
    } catch (err: any) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};
