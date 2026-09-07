import express from 'express';
import {signup, signin} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'Profile accessed successfully',
    user: req.user,
  });
});

export default router;//hi
