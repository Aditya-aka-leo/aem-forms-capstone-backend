class BaseModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static create(data) {
    return new this(data);
  }

  toJSON() {
    return { ...this };
  }

  validate() {
    const errors = [];
    
    if (!this.id) {
      errors.push('ID is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class Otp extends BaseModel {
  constructor(data = {}) {
    super(data);

    this.email = data.email;
    this.identifierType = data.identifierType;
    this.identifierValue = data.identifierValue;
    this.otp = data.otp;
    this.expiresAt = data.expiresAt || new Date(Date.now() + 5 * 60 * 1000).toISOString();
  }

  static validationRules = {
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    identifierType: { required: true, validValues: ['PAN', 'DOB', 'CC4DIGIT', 'DC4DIGIT'] },
    identifierValue: { required: true },
    otp: { pattern: /^\d{6}$/ }
  };

  validate() {
    const errors = [];
    const rules = Otp.validationRules;

    if (!this.email) {
      errors.push('Email is required');
    } else if (!rules.email.pattern.test(this.email)) {
      errors.push('Invalid email format');
    }

    if (!this.identifierType) {
      errors.push('Identifier type is required');
    } else if (!rules.identifierType.validValues.includes(this.identifierType)) {
      errors.push(`Identifier type must be one of: ${rules.identifierType.validValues.join(', ')}`);
    }

    if (!this.identifierValue) {
      errors.push('Identifier value is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isExpired() {
    return new Date() > new Date(this.expiresAt);
  }

  generateOtp() {
    this.otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    return this.otp;
  }

  isValidOtp(inputOtp) {
    return /^\d{6}$/.test(inputOtp);
  }

  verifyOtp(inputOtp) {
    if (!this.isValidOtp(inputOtp)) {
      return { success: false, message: 'OTP must be 6 digits' };
    }

    if (this.isExpired()) {
      return { success: false, message: 'OTP has expired' };
    }
    
    if (this.otp === inputOtp) {
      return { success: true, message: 'OTP verified successfully' };
    }
    
    return { success: false, message: 'Invalid OTP' };
  }

  static createFromFormData(formData) {
    return new Otp({
      email: formData.email,
      identifierType: formData.identifierType,
      identifierValue: formData.identifierValue
    });
  }
}

export default Otp;
