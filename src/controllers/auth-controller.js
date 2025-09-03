import { MONDAY_SIGNING_SECRET } from '../constants/secret-keys.js';
import { getSecret } from '../helpers/secret-store.js';
import { GithubAuthManager, MondayAuthManager } from '../services/auth-service.js';
import logger from '../services/logger/index.js';
import { ConnectionModelService } from '../services/model-services/connection-model-service.js';
import jwt from 'jsonwebtoken';

const TAG = 'auth_controller';
const githubAuthManager = new GithubAuthManager();
const mondayAuthManager = new MondayAuthManager();
const connectionModelService = new ConnectionModelService();

/**
 * Begins the Github OAuth flow.
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#the-authorization-url
 * @todo Connect this to your product's OAuth flow.
 */
export const authorize = async (req, res) => {
  const { userId, backToUrl } = req.session;
  const { token } = req.query;

  const connection = await connectionModelService.getConnectionByUserId(userId);
  if (connection?.githubToken && connection?.mondayToken) {
    return res.redirect(backToUrl);
  }

  const githubAuthorizationUrl = githubAuthManager.getAuthorizationUrl(userId, token);
  return res.redirect(githubAuthorizationUrl);
};

/**
 * Retrieves an monday.com OAuth token and then redirects the user to the backToUrl.
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#authorization-url-example
 * @todo Connect this to your product's OAuth flow.
 */
export const mondayCallback = async (req, res) => {
  const { code, state: mondayToken } = req.query;
  const { userId, backToUrl } = jwt.verify(mondayToken, getSecret(MONDAY_SIGNING_SECRET));
  logger.info('monday oauth callback', TAG, { userId, code, backToUrl });

  try {
    const mondayToken = await mondayAuthManager.getToken(code);
    await connectionModelService.upsertConnection(userId, { mondayToken });

    return res.redirect(backToUrl);
  } catch (err) {
    logger.error('monday oauth callback failed', TAG, { userId, error: err.message });
    return res.status(500).send({ message: 'internal server error' });
  }
};

/**
 * Retrieves an Github OAuth token and then redirects to monday.com OAuth flow.
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#authorization-url-example
 * @todo Connect this to your product's OAuth flow.
 */
export const githubCallback = async (req, res) => {
  const { code, state: mondayToken } = req.query;
  const { userId, backToUrl } = jwt.verify(mondayToken, getSecret(MONDAY_SIGNING_SECRET));
  logger.info('github oauth callback', TAG, { userId, code, backToUrl });

  try {
    const githubToken = await githubAuthManager.getToken(code);

    await connectionModelService.upsertConnection(userId, { githubToken });

    const mondayAuthorizationUrl = mondayAuthManager.getAuthorizationUrl(userId, mondayToken);
    return res.redirect(mondayAuthorizationUrl);
  } catch (err) {
    logger.error('github oauth callback failed', TAG, { userId, error: err.message });
    return res.status(500).send({ message: 'internal server error' });
  }
};

export async function getApiKeyStatus(req, res) {
  try {
    const { userId } = req.session;
    const apiKey = await connectionService.getApiKey(userId);
    if (apiKey) {
      // Key exists, return 200 OK.
      // You can optionally return a payload with non-sensitive data.
      return res.status(200).send({ connected: true });
    }
    // Key does not exist, return 404 Not Found.
    // monday.com will then redirect to the Authorization URL.
    return res.status(404).send({ message: 'API Key not found.' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function authorizeNotifier(req, res) {
  // This function should render a page where the user can input their API key.
  // For this example, we'll send a simple HTML file.
  // You should create a proper HTML page with a form.
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  res.sendFile(path.join(__dirname, '../../views/authorize.html'));
}

export async function saveApiKey(req, res) {
  try {
    const { userId } = req.session;
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).send({ message: 'API key is required.' });
    }

    await connectionModelService.saveApiKey(userId, apiKey);
    logInfo('API Key saved successfully', { userId });
    // After saving, you can close the window or redirect back to monday.com
    return res.status(200).send('<script>window.close();</script>');
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function deleteApiKey(req, res) {
  try {
    const { userId } = req.session;
    await connectionModelService.deleteApiKey(userId);
    logInfo('API Key deleted successfully', { userId });
    return res.status(200).send({ message: 'API Key deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}
