// Example controller with modern JavaScript syntax
class BaseController {
  constructor() {
    this.name = this.constructor.name;
  }

  // Modern error handling with proper HTTP status codes
  handleError = (res, error, statusCode = 500) => {
    console.error(`Error in ${this.name}:`, error);
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  };

  // Success response helper
  sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  };
}

class ExampleController extends BaseController {
  // Using arrow functions for automatic binding
  getExample = async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      // Simulate async operation
      const data = await this.fetchExampleData({ id, page, limit });
      
      return this.sendSuccess(res, data, 'Data retrieved successfully');
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createExample = async (req, res) => {
    try {
      const { body } = req;
      
      // Validate required fields
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Simulate data creation
      const newData = await this.createExampleData(body);
      
      return this.sendSuccess(res, newData, 'Data created successfully', 201);
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // Private method using # syntax (Node.js 12+)
  async fetchExampleData({ id, page, limit }) {
    // Simulate database query
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          items: Array.from({ length: +limit }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`,
            page: +page
          })),
          pagination: {
            page: +page,
            limit: +limit,
            total: 100
          }
        });
      }, 100);
    });
  }

  async createExampleData(data) {
    // Simulate data creation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }, 100);
    });
  }
}

export default new ExampleController();
