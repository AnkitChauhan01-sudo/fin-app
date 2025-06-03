import express from 'express';
import { register, login, getProfile } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

export const userRoutes = router; 