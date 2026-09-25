import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getAdminDashboardData } from '../controllers/adminController.js';

const router = express.Router();

// Apply auth and admin check to ALL routes in this file
router.use(protect, adminMiddleware);

router.get('/dashboard', getAdminDashboardData);

export default router;