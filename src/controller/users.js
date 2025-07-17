import mysqlConnector from '../utils/mySqlConnector.js';
import User from '../models/User.js';

class UserController {

  static async getAllUsers(req, res) {
    try {
      const query = 'SELECT * FROM users ORDER BY created_at DESC';
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
      const { transactionRefNumber, mobileNumber, partnerName, identifierName, productName, preferredLang } = req.body;

      // Create User instance using the model
      const userData = {
        transactionRefNumber,
        mobileNumber,
        partnerName: partnerName,
        identifierName,
        productName,
        preferredLang: preferredLang,
      };
      
      const user = User.createFromFormData(userData);
      
      // Validate the user data
      const validation = user.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Check if transaction ref number already exists
      const existingUserQuery = 'SELECT id FROM users WHERE transaction_ref_number = ?';
      const existingUsers = await mysqlConnector.execute(existingUserQuery, [user.transactionRefNumber]);
      
      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User with this transaction reference number already exists'
        });
      }

      // Insert new user
      const insertQuery = `
        INSERT INTO users (transaction_ref_number, mobile_number, partner_name, identifier_name, product_name, preferred_lang) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await mysqlConnector.execute(insertQuery, [
        user.transactionRefNumber,
        user.mobileNumber,
        user.partnerName,
        user.identifierName,
        user.productName,
        user.preferredLang
      ]);

      // Fetch the created user
      const newUserQuery = 'SELECT * FROM users WHERE id = ?';
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
