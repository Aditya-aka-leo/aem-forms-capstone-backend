import { Router } from 'express';
import UserController from '../controller/users.js';

const router = Router();

// User CRUD routes
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/create', UserController.createUser);
// Health check route
router.get('/health/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'User service is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

export default router;
