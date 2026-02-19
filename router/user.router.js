import express from 'express';
import {
  forgotPassword,
  getMe,
  login,
  logOut,
  register,
  resetPassword,
  verifyUser,
} from '../controller/user.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyUser);
router.get('/profile', isLoggedIn, getMe);
router.get('/logout', isLoggedIn, logOut);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
