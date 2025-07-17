import mysqlConnector from '../utils/mySqlConnector.js';

class UserController {

  static async getAllUsers(req, res) {
    try {
      const query = 'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC';
      const users = await mysqlConnector.execute(query);
      
      res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
      const users = await mysqlConnector.execute(query, [id]);
      
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: users[0]
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, email, password } = req.body;

      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUserQuery = 'SELECT id FROM users WHERE email = ? OR username = ?';
      const existingUsers = await mysqlConnector.execute(existingUserQuery, [email, username]);
      
      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }

      // Insert new user
      const insertQuery = `
        INSERT INTO users (username, email, password, created_at) 
        VALUES (?, ?, ?, NOW())
      `;
      const result = await mysqlConnector.execute(insertQuery, [username, email, password]);

      // Fetch the created user
      const newUserQuery = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
      const newUser = await mysqlConnector.execute(newUserQuery, [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser[0]
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  }
}

export default UserController;
