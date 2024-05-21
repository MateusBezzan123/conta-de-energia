import { Router } from 'express';
import { uploadBill } from '../controllers/billController';

const router = Router();

router.post('/upload', uploadBill);

export default router;
