import ConnectionStorage from '../../storage/connection-storage.js';
import logger from '../logger/index.js';

const TAG = 'connection_model_service';

/** @typedef {Object} Connection
 * @property {string} userId - The monday user ID
 * @property {string} apiKey - The third-party API key of the user
 */

/**
 * A service for interacting with Connection objects.
 * A Connection defines a relation between a monday user and their third-party API key credentials.
 *
 * @returns {ConnectionModelService} - An instance of the ConnectionModelService
 * @example
 * const connectionModelService = new ConnectionModelService();
 * const connection = await connectionModelService.getConnectionByUserId(userId);
 *
 * @example
 * const connectionModelService = new ConnectionModelService();
 * const connection = await connectionModelService.upsertConnection(userId, attributes);
 */
export class ConnectionModelService {
  constructor() {
    this.secureStorage = new ConnectionStorage();
  }

  /**
   * Retrieve a connection based on a monday user ID.
   * @param {string} userId - The monday user ID
   * @returns {Promise<Connection>} - The fetched connection
   */
  async getConnectionByUserId(userId) {
    try {
      const response = await this.secureStorage.get(userId);
      return response;
    } catch (err) {
      logger.error('Failed to retrieve connection by user ID', TAG, { userId, error: err.message });
    }
  }

  /**
   * Create or update a Connection record in the DB.
   * A connection defines a relation between a monday user and their third-party API key credentials.
   * @param {string} userId - The monday user ID
   * @param {Object} attributes - The attributes of the connection
   * @param {string=} attributes.apiKey - The API key for third-party service
   * @returns {Promise<Connection>} - The created/updated connection
   */
  async upsertConnection(userId, attributes) {
    const { apiKey } = attributes;
    const connection = await this.getConnectionByUserId(userId);
    const newConnection = {
      ...connection,
      ...(apiKey && { apiKey }),
      userId,
    };
    try {
      const response = await this.secureStorage.set(userId, newConnection);

      if (!response) {
        throw new Error('Failed to create connection');
      }

      return { userId, apiKey };
    } catch (err) {
      logger.error('Failed to create connection', TAG, { userId, error: err.message });
    }
  }

  /**
   * Delete a Connection record in the DB.
   * @param {string} userId - The monday user ID
   * @returns {Promise<void>}
   */
  async deleteConnection(userId) {
    try {
      const response = await this.secureStorage.delete(userId);

      if (!response) {
        throw new Error('Failed to delete connection');
      }
    } catch (err) {
      logger.error('Failed to delete connection', TAG, { userId, error: err.message });
    }
  }
}
