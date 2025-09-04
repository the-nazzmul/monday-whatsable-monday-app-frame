import logger from '../services/logger/index.js';
import { ConnectionModelService } from '../services/model-services/connection-model-service.js';
import path from 'path';
import { fileURLToPath } from 'url';

const TAG = 'auth_controller';
const connectionModelService = new ConnectionModelService();

/**
 * API Key Management Controller
 * Handles all operations related to third-party API key credentials
 */

export async function getApiKeyStatus(req, res) {
  try {
    const { userId } = req.session;
    logger.info('Getting API key status', TAG, { userId });

    const connection = await connectionModelService.getConnectionByUserId(userId);
    const apiKey = connection?.apiKey;

    if (apiKey) {
      // Key exists, return 200 OK with masked key for display
      logger.info('API key found for user', TAG, { userId });
      return res.status(200).send({
        connected: true,
        // Return a masked version of the key for display purposes
        maskedKey: apiKey.substring(0, 4) + '••••••••' + apiKey.substring(apiKey.length - 4),
      });
    }

    // Key does not exist, return 404 Not Found.
    // monday.com will then redirect to the Authorization URL.
    logger.info('API key not found for user', TAG, { userId });
    return res.status(404).send({ message: 'API Key not found.' });
  } catch (err) {
    logger.error('Failed to get API key status', TAG, { userId: req.session?.userId, error: err.message });
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function authorizeNotifier(req, res) {
  try {
    const { userId } = req.session;
    logger.info('Rendering authorization page', TAG, { userId });

    // Check if user already has an API key
    const connection = await connectionModelService.getConnectionByUserId(userId);
    const existingApiKey = connection?.apiKey;

    // This function should render a page where the user can input their API key.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    res.sendFile(path.join(__dirname, '../../views/authorize.html'));
  } catch (err) {
    logger.error('Failed to render authorization page', TAG, { userId: req.session?.userId, error: err.message });
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function saveApiKey(req, res) {
  try {
    const { userId } = req.session;
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).send({ message: 'API key is required.' });
    }

    // Save the API key using the connection model service
    await connectionModelService.upsertConnection(userId, { apiKey });
    logger.info('API Key saved successfully', TAG, { userId });

    // After saving, you can close the window or redirect back to monday.com
    return res.status(200).send('<script>window.close();</script>');
  } catch (err) {
    logger.error('Failed to save API key', TAG, { userId: req.session?.userId, error: err.message });
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function deleteApiKey(req, res) {
  try {
    const { userId } = req.session;

    // Get existing connection and remove only the apiKey
    const connection = await connectionModelService.getConnectionByUserId(userId);
    if (connection) {
      const { apiKey, ...connectionWithoutApiKey } = connection;
      await connectionModelService.upsertConnection(userId, connectionWithoutApiKey);
    }

    logger.info('API Key deleted successfully', TAG, { userId });
    return res.status(200).send({ message: 'API Key deleted successfully' });
  } catch (err) {
    logger.error('Failed to delete API key', TAG, { userId: req.session?.userId, error: err.message });
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}
