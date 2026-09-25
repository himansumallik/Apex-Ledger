import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createAccount, getAccounts } from '../controllers/accountController.js';

const router = express.Router();

router.post('/', protect, createAccount);
router.get(`/`, protect, getAccounts);

export default router;