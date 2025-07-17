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

class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    
    this.transactionRefNumber = data.transactionRefNumber;
    this.mobileNumber = data.mobileNumber;
    this.partnerName = data.partnerName;
    this.identifierName = data.identifierName;
    this.productName = data.productName;
    this.dateTime = data.dateTime || new Date().toISOString();
    this.preferredLang = data.preferredLang;
  }

  isValidMobileNumber(mobile) {
    return /^\d{10}$/.test(mobile);
  }

  isValidIdentifierName(identifier) {
    const validIdentifiers = ['PAN', 'DOB', 'CC4DIGIT', 'DC4DIGIT'];
    return validIdentifiers.includes(identifier);
  }

  static validationRules = {
    transactionRefNumber: { required: true },
    mobileNumber: { required: true, pattern: /^\d{10}$/ },
    partnerName: { required: true },
    identifierName: { required: true, validValues: ['PAN', 'DOB', 'CC4DIGIT', 'DC4DIGIT'] },
    productName: { required: true },
    dateTime: { required: true },
    preferredLang: { required: false, default: 'ENG' }
  };

  validate() {
    const errors = [];
    const rules = User.validationRules;

    if (!this.transactionRefNumber) {
      errors.push('Transaction reference number is required');
    }

    if (!this.mobileNumber) {
      errors.push('Mobile number is required');
    } else if (!rules.mobileNumber.pattern.test(this.mobileNumber)) {
      errors.push('Mobile number must be exactly 10 digits');
    }

    if (!this.partnerName) {
      errors.push('Partner name is required');
    }

    if (!this.identifierName) {
      errors.push('Identifier name is required');
    } else if (!rules.identifierName.validValues.includes(this.identifierName)) {
      errors.push(`Identifier name must be one of: ${rules.identifierName.validValues.join(', ')}`);
    }

    if (!this.productName) {
      errors.push('Product name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createFromApi(apiData) {
    return new User({
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
      transactionRefNumber: apiData.transactionRefNumber,
      mobileNumber: apiData.mobileNumber,
      partnerName: apiData.partnerName,
      identifierName: apiData.identifierName,
      productName: apiData.productName,
      dateTime: apiData.dateTime,
      preferredLang: apiData.preferredLang
    });
  }

  static createFromFormData(formData) {
    return new User({
      transactionRefNumber: formData.transactionRefNumber,
      mobileNumber: formData.mobileNumber,
      partnerName: formData.partnerName || 'Adobe',
      identifierName: formData.identifierName,
      productName: formData.productName,
      preferredLang: formData.preferredLang || 'ENG'
    });
  }
}

export default User;
