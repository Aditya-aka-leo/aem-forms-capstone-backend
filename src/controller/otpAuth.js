import mysqlConnector from '../utils/mySqlConnector.js';
import Otp from '../models/Otp.js';

class OtpController {

  static async generateOtp(req, res) {
    try {
      const { email, identifierType, identifierValue } = req.body;

      const otpData = {
        email,
        identifierType,
        identifierValue
      };
      
      const otp = Otp.createFromFormData(otpData);
      
      const validation = otp.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const userCheckQuery = `
        SELECT id FROM users 
        WHERE identifier_name = ? AND identifier_value = ? AND email = ?
      `;
      const userExists = await mysqlConnector.execute(userCheckQuery, [
        identifierType,
        identifierValue,
        email
      ]);

      if (userExists.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found with the provided email and identifier'
        });
      }

      const otpCode = otp.generateOtp();

      const insertQuery = `
        INSERT INTO otps (email, identifier_type, identifier_value, otp, expires_at) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const result = await mysqlConnector.execute(insertQuery, [
        otp.email,
        otp.identifierType,
        otp.identifierValue,
        otp.otp,
        otp.expiresAt
      ]);

      res.status(201).json({
        success: true,
        message: 'OTP generated and sent successfully',
        data: {
          email: otp.email,
          expiresIn: '5 minutes'
        }
      });
    } catch (error) {
      console.error('Error generating OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate OTP',
        error: error.message
      });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { otp } = req.body;

      if (!otp) {
        return res.status(400).json({
          success: false,
          message: 'OTP is required'
        });
      }

      const findQuery = `
        SELECT * FROM otps 
        WHERE otp = ? AND expires_at > NOW() 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      const otpRecords = await mysqlConnector.execute(findQuery, [otp]);

      if (otpRecords.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      const otpRecord = new Otp(otpRecords[0]);

      const verification = otpRecord.verifyOtp(otp);

      if (verification.success) {
        const deleteQuery = 'DELETE FROM otps WHERE id = ?';
        await mysqlConnector.execute(deleteQuery, [otpRecords[0].id]);

        res.status(200).json({
          success: true,
          message: 'OTP verified successfully',
          data: {
            email: otpRecord.email,
            identifierType: otpRecord.identifierType,
            identifierValue: otpRecord.identifierValue
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: verification.message
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP',
        error: error.message
      });
    }
  }
}

export default OtpController;


