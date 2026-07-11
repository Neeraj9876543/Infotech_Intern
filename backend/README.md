# Restaurant Reservation Management System - Backend

A production-ready Node.js/Express backend for a Restaurant Reservation Management System with MongoDB Atlas integration, JWT authentication, and automatic table assignment.

## Features

- **JWT Authentication**: Secure user registration and login with bcrypt password hashing
- **Role-Based Access Control**: Customer and Admin roles with appropriate permissions
- **Automatic Table Assignment**: Smart table assignment based on guest count and availability
- **Reservation Management**: Create, view, update, and cancel reservations
- **Table Management**: Admin can manage restaurant tables
- **Conflict Prevention**: Prevents double booking and invalid reservations
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Helmet, CORS, environment variables, and JWT expiration
- **Error Handling**: Centralized error handling with meaningful messages
- **Logging**: Morgan logging in development mode

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas compatible)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **express-validator** - Request validation

## Folder Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── reservationController.js  # Reservation business logic
│   └── tableController.js   # Table management logic
├── middlewares/
│   ├── auth.js             # Authentication & authorization middleware
│   ├── errorHandler.js     # Centralized error handling
│   └── notFound.js         # 404 handler
├── models/
│   ├── User.js             # User schema
│   ├── Table.js            # Table schema
│   └── Reservation.js      # Reservation schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── reservations.js     # Reservation routes
│   └── tables.js           # Table routes
├── seed/
│   └── seedTables.js       # Database seeding script
├── utils/
│   ├── jwt.js              # JWT utilities
│   └── responseHandler.js  # Response formatting
├── validators/
│   ├── authValidator.js    # Authentication validation
│   ├── reservationValidator.js  # Reservation validation
│   └── tableValidator.js   # Table validation
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (not in git)
└── .env.example            # Environment variables template
```

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/restaurant_reservation
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Seed the database with tables**
   ```bash
   npm run seed
   ```

## Running Locally

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on the port specified in `.env` (default: 5000).

## Database Seeding

The seed script creates the following tables:
- Table 1: Capacity 2
- Table 2: Capacity 2
- Table 3: Capacity 4
- Table 4: Capacity 4
- Table 5: Capacity 6
- Table 6: Capacity 8

Run the seed script:
```bash
npm run seed
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"  // optional, defaults to "customer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Reservation Endpoints (Customer)

#### Create Reservation
```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "reservationDate": "2024-12-25",
  "timeSlot": "7PM",
  "guests": 4
}
```

**Response:** Automatically assigns the smallest available table with sufficient capacity.

#### Get My Reservations
```http
GET /api/reservations/my
Authorization: Bearer <token>
```

#### Cancel Reservation
```http
DELETE /api/reservations/:id
Authorization: Bearer <token>
```

### Reservation Endpoints (Admin)

#### Get All Reservations
```http
GET /api/reservations/admin/all
Authorization: Bearer <token>

Optional Query: ?date=2024-12-25
```

#### Update Reservation
```http
PUT /api/reservations/admin/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "timeSlot": "8PM",
  "guests": 6
}
```

#### Delete Reservation
```http
DELETE /api/reservations/admin/:id
Authorization: Bearer <token>
```

### Table Endpoints (Admin)

#### Get All Tables
```http
GET /api/tables
Authorization: Bearer <token>
```

#### Create Table
```http
POST /api/tables
Authorization: Bearer <token>
Content-Type: application/json

{
  "tableNumber": "7",
  "capacity": 10,
  "isActive": true
}
```

#### Update Table
```http
PUT /api/tables/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "capacity": 12,
  "isActive": false
}
```

#### Delete Table
```http
DELETE /api/tables/:id
Authorization: Bearer <token>
```

### Table Endpoints (Customer)

#### Get Available Tables
```http
GET /api/tables/available
Authorization: Bearer <token>

Optional Query: ?date=2024-12-25&timeSlot=7PM&guests=4
```

## Authentication & Authorization

### JWT Authentication
- Users receive a JWT token upon registration/login
- Token must be included in the Authorization header: `Bearer <token>`
- Tokens expire after 30 days
- Passwords are hashed using bcrypt before storage

### Role-Based Access Control

**Customer Role:**
- Create reservations
- View own reservations
- Cancel own reservations
- View available tables

**Admin Role:**
- All customer permissions
- View all reservations
- Update any reservation
- Delete any reservation
- Create, update, and delete tables

## Reservation Logic

### Automatic Table Assignment
The system automatically assigns the most suitable table based on:
1. **Capacity**: Table must accommodate all guests
2. **Availability**: Table must not be booked for the same date and time
3. **Efficiency**: Assigns the smallest suitable table to maximize capacity

### Example
- Tables available: Table 1 (capacity 2), Table 2 (capacity 4), Table 3 (capacity 6)
- Request: 4 guests
- Result: Assigns Table 2 (smallest table that fits 4 guests)

### Conflict Prevention
- Prevents double booking the same table at the same time
- Validates future dates only
- Ensures guest count is at least 1
- Validates time slots against allowed values
- Returns 409 Conflict if no suitable table is available

### Allowed Time Slots
11AM, 12PM, 1PM, 2PM, 3PM, 4PM, 5PM, 6PM, 7PM, 8PM, 9PM

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["error details"]
}
```

### HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (no available tables)
- **500** - Internal Server Error

## Deployment (Render)

### Prerequisites
- MongoDB Atlas account and connection string
- Render account

### Steps

1. **Prepare for Deployment**
   - Ensure all environment variables are set in Render dashboard
   - Update `CLIENT_URL` to your frontend production URL
   - Set `NODE_ENV=production`

2. **Required Environment Variables in Render**
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/restaurant_reservation
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://your-frontend-url.com
   NODE_ENV=production
   ```

3. **Deploy to Render**
   - Connect your GitHub repository
   - Select the backend folder as root directory
   - Render will automatically detect Node.js and run `npm start`
   - Add environment variables in Render dashboard

4. **Post-Deployment**
   - Run the seed script once to populate tables (can be done via Render shell or locally with production MONGO_URI)
   - Test API endpoints using the provided Render URL

## Security Features

- **Helmet**: Sets security-related HTTP headers
- **CORS**: Configured for specific frontend origin
- **bcrypt**: Password hashing with salt rounds
- **JWT**: Token-based authentication with expiration
- **Environment Variables**: Sensitive data never in code
- **Input Validation**: All inputs validated before processing
- **No Password Exposure**: Passwords never returned in responses

## Known Limitations

- No email verification for registration
- No password reset functionality
- No rate limiting on API endpoints
- No file upload support
- No real-time notifications
- Time slots are fixed (not configurable)

## Future Improvements

- Add email verification and password reset
- Implement rate limiting
- Add real-time notifications using Socket.io
- Create admin dashboard APIs
- Add analytics and reporting endpoints
- Implement caching with Redis
- Add pagination for large datasets
- Create configurable time slots
- Add support for recurring reservations

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check network connectivity
- Verify database user permissions

### Port Already in Use
- Change PORT in `.env` file
- Kill process using the port

### JWT Token Errors
- Ensure JWT_SECRET is set in `.env`
- Check token expiration (30 days)
- Verify token format in Authorization header

### Seed Script Issues
- Ensure database connection is working
- Check if tables already exist (script clears existing tables)
- Run with `NODE_ENV=development npm run seed` for verbose output

## License

ISC

## Support

For issues and questions, please refer to the project documentation or contact the development team.
