// Database configuration
export const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '9053', // Add your MySQL password here
    name: process.env.DB_NAME || 'aem_forms_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10
  },
  server: {
    port: parseInt(process.env.PORT) || 8081,
    environment: process.env.NODE_ENV || 'development'
  }
};

export default config;
