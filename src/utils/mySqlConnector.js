import mysql from 'mysql2/promise';
import { config } from './config.js';

class MySQLConnector {
  constructor() {
    this.pool = null;
    this.connection = null;
  }

  async initializePool() {
    try {
      this.pool = mysql.createPool({
        host: config.database.host || 'localhost',
        port: config.database.port || 3306,
        user: config.database.user || 'root',
        password: config.database.password || '',
        database: config.database.name || 'aem_forms_db',
        connectionLimit: config.database.connectionLimit || 10,
        charset: 'utf8mb4',
        ssl: false, // Set to true if using SSL
        multipleStatements: false
      });

      await this.testConnection();
      console.log('✅ MySQL connection pool initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize MySQL connection pool:', error.message);
      throw error;
    }
  }

  async getConnection() {
    if (!this.pool) {
      await this.initializePool();
    }
    return await this.pool.getConnection();
  }

  async execute(query, params = []) {
    let connection;
    try {
      connection = await this.getConnection();
      const [rows] = await connection.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw new Error(`Database operation failed: ${error.message}`);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async testConnection() {
    let connection;
    try {
      connection = await this.getConnection();
      await connection.ping();
      console.log('📡 Database connection test successful');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error.message);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async closePool() {
    if (this.pool) {
      try {
        await this.pool.end();
        console.log('🔒 MySQL connection pool closed');
      } catch (error) {
        console.error('Error closing connection pool:', error.message);
      }
    }
  }
}

const mysqlConnector = new MySQLConnector();

export default mysqlConnector;
export { MySQLConnector };
