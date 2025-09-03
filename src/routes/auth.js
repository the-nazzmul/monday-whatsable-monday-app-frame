import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.js';
import * as authController from '../controllers/auth-controller.js';

const router = Router();

router.get('/auth', authenticationMiddleware, authController.authorize);
router.get('/auth/github/callback/:userId', authController.githubCallback);
router.get('/auth/monday/callback', authController.mondayCallback);

router.get('/monday/authorize', authController.authorizeNotifier);

// credential URL
router.get('/get-api-key', authenticationMiddleware, authController.getApiKeyStatus);

// authorization page POST
router.post('/save-api-key', authenticationMiddleware, authController.saveApiKey);

// delete credential
router.post('/delete-api-key', authenticationMiddleware, authController.deleteApiKey);

export default router;
