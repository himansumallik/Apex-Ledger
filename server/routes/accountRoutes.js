import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createAccount } from '../controllers/accountController.js';

const router = express.Router();

router.post('/', protect, createAccount);

export default router;