import { Router } from 'express';
import { uploadBill, getBills, getBillById, downloadBill } from '../controllers/billController';

const router = Router();

router.post('/upload', uploadBill);
router.get('/bills', getBills);
router.get('/bills/:id', getBillById);
router.get('/bills/:id/download', downloadBill);


export default router;
