import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import users from './src/routes/user.js';
import mysqlConnector from './src/utils/mySqlConnector.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', users);

app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path
  });
});

const PORT = process.env.PORT || 8081;

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await mysqlConnector.initializePool();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Access URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();