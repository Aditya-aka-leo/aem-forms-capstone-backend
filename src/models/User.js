// Example model using modern JavaScript features
class BaseModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Static method for creating instances
  static create(data) {
    return new this(data);
  }

  // Method to update timestamps
  touch() {
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return { ...this };
  }

  // Validation method
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
    this.name = data.name || '';
    this.email = data.email || '';
    this.age = data.age || null;
    this.status = data.status || 'active';
  }

  // Getter for full name
  get displayName() {
    return this.name.trim() || 'Unknown User';
  }

  // Setter with validation
  set email(value) {
    this._email = value?.toLowerCase().trim() || '';
  }

  get email() {
    return this._email;
  }

  // Method with modern syntax
  isAdult = () => this.age >= 18;

  // Static validation rules
  static validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { min: 0, max: 150 }
  };

  // Override parent validation
  validate() {
    const { isValid: baseValid, errors } = super.validate();
    const rules = User.validationRules;

    // Validate name
    if (!this.name || this.name.length < rules.name.minLength) {
      errors.push(`Name must be at least ${rules.name.minLength} characters`);
    }

    // Validate email
    if (!this.email) {
      errors.push('Email is required');
    } else if (!rules.email.pattern.test(this.email)) {
      errors.push('Invalid email format');
    }

    // Validate age
    if (this.age !== null) {
      if (this.age < rules.age.min || this.age > rules.age.max) {
        errors.push(`Age must be between ${rules.age.min} and ${rules.age.max}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Static factory methods
  static createFromApi(apiData) {
    return new User({
      id: apiData.id,
      name: apiData.full_name || apiData.name,
      email: apiData.email_address || apiData.email,
      age: apiData.age,
      status: apiData.is_active ? 'active' : 'inactive',
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at
    });
  }

  // Method chaining example
  updateProfile({ name, email, age }) {
    if (name) this.name = name;
    if (email) this.email = email;
    if (age !== undefined) this.age = age;
    
    return this.touch();
  }
}

// Example of modern export with multiple exports
export { BaseModel, User };
export default User;
