import express from 'express';
import {
    login,
    logout,
    register,
    checkAuth,
    forgotPassword,
    resetPassword,
    updatePassword
} from '../controllers/auth.js';
import authenticateUser from '../middleware/authenticationMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

// Password Management
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/update-password', authenticateUser, updatePassword);

router.get('/check-auth', authenticateUser, checkAuth);

export default router;