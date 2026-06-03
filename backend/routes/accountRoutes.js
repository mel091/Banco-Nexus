import express from 'express';
import { getDashboard, getHistory, addDestinationAccount, getDestinationAccounts } from '../controllers/accountController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.get('/transactions', protect, getHistory);
router.route('/destinations').post(protect, addDestinationAccount).get(protect, getDestinationAccounts);

export default router;
