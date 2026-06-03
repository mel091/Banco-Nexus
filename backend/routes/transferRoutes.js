import express from 'express';
import { executeTransfer } from '../controllers/transferController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, executeTransfer);

export default router;
