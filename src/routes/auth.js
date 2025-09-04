import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.js';
import * as authController from '../controllers/auth-controller.js';

const router = Router();

// API Key Management Routes
router.get('/monday/authorize', authController.authorizeNotifier);
router.get('/get-api-key', authenticationMiddleware, authController.getApiKeyStatus);
router.post('/save-api-key', authenticationMiddleware, authController.saveApiKey);
router.post('/delete-api-key', authenticationMiddleware, authController.deleteApiKey);

export default router;
