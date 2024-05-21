import { Router } from 'express';
import { uploadBill, getBills, getBillById } from '../controllers/billController';

const router = Router();

router.post('/upload', uploadBill);
router.get('/bills', getBills);
router.get('/bills/:id', getBillById);

export default router;
