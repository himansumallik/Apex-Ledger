import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createAccount, getAccounts, adminDashboard } from '../controllers/accountController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createAccount);
router.get(`/`, protect, getAccounts);
router.get('/admin-dashboard-data', protect,adminMiddleware, adminDashboard);

export default router;