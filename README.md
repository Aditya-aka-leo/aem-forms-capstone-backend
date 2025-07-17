# AEM Forms Capstone Backend

A modern Node.js backend application with MySQL database connectivity using the latest JavaScript syntax.

## Features

- ✅ ES Modules (ESM) syntax
- ✅ Modern async/await patterns
- ✅ MySQL connection pooling
- ✅ Environment variable configuration
- ✅ Error handling and logging
- ✅ CRUD operations for users
- ✅ Database transaction support

## Prerequisites

- Node.js >= 18.0.0
- MySQL Server (local or remote)
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd c:\Work\aem-forms-capstone-backend
npm install
```

### 2. Database Setup

1. Make sure MySQL server is running on your local machine
2. Open MySQL Workbench or command line client
3. Run the SQL script:

```bash
mysql -u root -p < database_setup.sql
```

Or execute the queries manually:
- Create database `aem_forms_db`
- Create the `users` table
- Insert sample data

### 3. Environment Configuration

1. Update the `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=aem_forms_db
DB_CONNECTION_LIMIT=10

PORT=8081
NODE_ENV=development
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:8081`

## API Endpoints

### User Management

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/stats/database` - Get database statistics
- `GET /users/health/status` - Health check

### Example Requests

#### Create User
```bash
curl -X POST http://localhost:8081/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

#### Get All Users
```bash
curl http://localhost:8081/users
```

#### Get User by ID
```bash
curl http://localhost:8081/users/1
```

## Project Structure

```
aem-forms-capstone-backend/
├── src/
│   ├── controller/
│   │   └── users.js          # User controller with CRUD operations
│   ├── routes/
│   │   └── user.js           # User routes
│   └── utils/
│       ├── mySqlConnector.js # Modern MySQL connector
│       └── config.js         # Configuration management
├── .env                      # Environment variables
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
└── database_setup.sql        # Database setup script
```

## Modern JavaScript Features Used

- **ES Modules**: `import/export` syntax
- **Async/await**: Modern asynchronous programming
- **Class syntax**: Modern class definitions
- **Template literals**: String interpolation
- **Destructuring**: Object and array destructuring
- **Arrow functions**: Concise function syntax
- **Optional chaining**: Safe property access
- **Connection pooling**: Efficient database connections

## Database Connection Features

- Connection pooling for better performance
- Automatic reconnection
- Transaction support
- Prepared statements for security
- Error handling and logging
- Connection health monitoring

## Troubleshooting

### Connection Issues

1. Check if MySQL server is running
2. Verify credentials in `.env` file
3. Ensure database `aem_forms_db` exists
4. Check firewall settings
5. Verify MySQL port (default: 3306)

### Common Errors

- **ECONNREFUSED**: MySQL server not running
- **ER_ACCESS_DENIED_ERROR**: Wrong credentials
- **ER_BAD_DB_ERROR**: Database doesn't exist

## License

ISC
