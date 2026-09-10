import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {deposit, withdraw, getTransactions} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.get('/:accountId', protect, getTransactions);

export default router;