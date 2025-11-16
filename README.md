# Mersal

A real-time chat application similar to WhatsApp, built with modern web technologies.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## Features

- 🔐 User authentication (Sign up, Login)
- 💬 Real-time messaging with Socket.io
- 📦 Messages buffering
- 📸 Image sharing via Cloudinary
- 👥 Contact management
- 💾 Chat history
- 🔊 Sound effects (keyboard sounds, notifications)
- 🎨 Modern, responsive UI with TailwindCSS

## Tech Stack

### Backend
- **Node.js & Express** - Server runtime and web framework for building RESTful APIs and handling HTTP requests
- **MongoDB with Mongoose** - NoSQL database for storing user data, messages, and chat history with schema validation
- **Socket.io** - Enables real-time bidirectional communication between server and clients, allowing instant message delivery without page refresh
- **JWT (jsonwebtoken)** - Secure token-based authentication system for user sessions and API access control
- **Cloudinary** - Cloud-based image storage and CDN service for handling user profile pictures and message image uploads
- **Nodemailer** - Email service integration for sending verification emails and notifications to users
- **Arcjet** - Security middleware for rate limiting, bot protection, and preventing abuse of authentication endpoints
- **bcryptjs** - Password hashing library for securely storing user credentials
- **cookie-parser** - Middleware for parsing and managing HTTP cookies, used for JWT token storage

### Frontend
- **React 19** - UI library for building interactive, component-based user interfaces
- **Vite** - Fast build tool and development server with hot module replacement for rapid development
- **TailwindCSS & DaisyUI** - Utility-first CSS framework and component library for styling the modern, responsive chat interface
- **Zustand** - Lightweight state management library for managing global application state (user auth, chats, messages)
- **Socket.io-client** - Client-side library that connects to the Socket.io server for receiving real-time message updates
- **React Router** - Declarative routing for navigation between login, signup, and chat pages
- **Axios** - HTTP client for making API requests to the backend server (authentication, fetching messages, etc.)
- **react-hot-toast** - Toast notification library for displaying success/error messages to users
- **lucide-react** - Icon library providing modern, customizable icons for the UI

## Prerequisites

- Node.js >= 20.0.0
- MongoDB database (local or cloud instance like MongoDB Atlas)
- Cloudinary account (for image uploads) - [Sign up here](https://cloudinary.com/users/register_free)
- Gmail SMTP credentials (for email services) - [Get App Password](https://support.google.com/accounts/answer/185833)
- Arcjet API key (for security) - [Get API Key](https://arcjet.com)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ezzo0/Mersal.git
cd Mersal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section below)

4. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Image Storage)
# Get credentials from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Gmail SMTP)
# Enable 2FA and create App Password: https://support.google.com/accounts/answer/185833
GOOGLE_SMTP_USER=your_gmail_address
GOOGLE_SMTP_KEY=your_gmail_app_password

# Security (Arcjet)
# Get API key from: https://arcjet.com
ARCJET_KEY=your_arcjet_api_key
```

### Environment Variable Descriptions

- **PORT**: Port number for the backend server (default: 3000)
- **NODE_ENV**: Environment mode - `development` or `production`
- **CLIENT_URL**: Frontend application URL for CORS configuration
- **MONGO_URI**: MongoDB connection string (format: `mongodb://localhost:27017/mersal` or MongoDB Atlas connection string)
- **JWT_SECRET**: Secret key for signing JWT tokens (use a strong, random string)
- **CLOUDINARY_CLOUD_NAME**: Your Cloudinary cloud name from the dashboard
- **CLOUDINARY_API_KEY**: Your Cloudinary API key
- **CLOUDINARY_API_SECRET**: Your Cloudinary API secret
- **GOOGLE_SMTP_USER**: Your Gmail address for sending emails
- **GOOGLE_SMTP_KEY**: Gmail App Password (not your regular password)
- **ARCJET_KEY**: Arcjet API key for rate limiting and security

## Production Build

```bash
npm run build
npm start
```

## Usage

### Accessing the Application

After starting both servers:
- **Frontend**: Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)
- **Backend API**: Running on `http://localhost:3000` (or the port specified in your `.env` file)

### Getting Started

1. **Sign Up**: Create a new account by providing your name, email, and password
   - You'll receive a verification email (if email service is configured)
   - After verification, you can log in

2. **Login**: Use your credentials to access the chat application

3. **Using the Chat Interface**:
   - **Left Sidebar**: 
     - View your profile at the top
     - Switch between "Chats" and "Contacts" tabs
     - "Chats" shows your conversation history
     - "Contacts" displays all available users to start new conversations
   
   - **Main Chat Area**:
     - Select a user from the chats or contacts list to open a conversation
     - View message history in the chat container
     - Send text messages or images using the input area at the bottom
     - Messages are delivered in real-time using Socket.io

4. **Special Features**:
   - **Image Sharing**: Click the image icon in the message input to attach and send images
   - **Sound Effects**: The app includes keyboard sounds and notification sounds (can be toggled if implemented)
   - **Real-time Updates**: Messages appear instantly without refreshing the page
   - **Chat History**: All your conversations are saved and accessible from the Chats tab

### Important Notes

- Make sure both backend and frontend servers are running simultaneously
- Ensure your MongoDB database is running and accessible
- For image uploads to work, Cloudinary credentials must be properly configured
- Real-time messaging requires both Socket.io servers (backend) and clients (frontend) to be connected

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

Most endpoints require authentication via JWT token stored in HTTP-only cookies. The token is automatically set after successful login/signup.

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": ""
}
```

**Error Responses:**
- `400` - All fields required / User already exists / Invalid email / Password too short
- `500` - Internal server error

---

#### POST `/api/auth/login`
Authenticate and log in a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": ""
}
```

**Error Responses:**
- `400` - All fields required / Invalid email or password
- `500` - Internal server error

---

#### POST `/api/auth/logout`
Log out the current user (requires authentication).

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET `/api/auth/check-auth`
Check if the current user is authenticated (requires authentication).

**Response (200):**
```json
{
  "id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": ""
}
```

**Error Responses:**
- `401` - Unauthorized

---

#### PUT `/api/auth/update-profile`
Update user profile picture (requires authentication).

**Request Body:**
```json
{
  "profilePic": "base64_encoded_image_or_url"
}
```

**Response (200):**
```json
{
  "id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": "https://cloudinary_url/image.jpg"
}
```

**Error Responses:**
- `400` - Profile picture is required
- `401` - Unauthorized
- `500` - Internal server error

### Message Endpoints

All message endpoints require authentication.

#### GET `/api/messages/contacts`
Get all available contacts (users except current user).

**Response (200):**
```json
[
  {
    "_id": "user_id",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "profilePic": "https://cloudinary_url/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### GET `/api/messages/chats`
Get all chat partners (users you have conversations with).

**Response (200):**
```json
[
  {
    "_id": "user_id",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "profilePic": "https://cloudinary_url/image.jpg"
  }
]
```

---

#### GET `/api/messages/:id`
Get all messages between current user and specified user.

**Parameters:**
- `id` - User ID of the chat partner

**Response (200):**
```json
[
  {
    "_id": "message_id",
    "senderId": "sender_user_id",
    "receiverId": "receiver_user_id",
    "text": "Hello!",
    "image": "",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Internal server error

### Socket.io Events

#### Client to Server

- **`sendMessage`** - Send a new message
  ```javascript
  socket.emit('sendMessage', {
    receiverId: 'user_id',
    text: 'Hello!',
    image: 'base64_image_or_null'
  });
  ```

#### Server to Client

- **`newMessage`** - Receive a new message
  ```javascript
  socket.on('newMessage', (message) => {
    // Handle new message
  });
  ```

## Database Schema

### User Model

Stores user account information.

```javascript
{
  email: String (required, unique),
  fullName: String (required),
  password: String (required, minlength: 8, hashed with bcrypt),
  profilePic: String (default: ""),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Fields:**
- `email` - User's email address (unique identifier)
- `fullName` - User's full name
- `password` - Hashed password using bcryptjs
- `profilePic` - URL to user's profile picture (stored on Cloudinary)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Message Model

Stores chat messages between users.

```javascript
{
  senderId: ObjectId (required, ref: "User"),
  receiverId: ObjectId (required, ref: "User"),
  text: String (trimmed, maxlength: 2000),
  image: String (optional, Cloudinary URL),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Fields:**
- `senderId` - Reference to User who sent the message
- `receiverId` - Reference to User who receives the message
- `text` - Message text content (optional if image is present)
- `image` - URL to message image (stored on Cloudinary, optional)
- `createdAt` - Message creation timestamp
- `updatedAt` - Last update timestamp

**Relationships:**
- Both `senderId` and `receiverId` reference the `User` model
- Messages are sorted by `createdAt` for chronological display

## Security Considerations

### Authentication & Authorization

- **JWT Tokens**: Stored in HTTP-only cookies to prevent XSS attacks
- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 10
- **Token Expiration**: JWT tokens should have expiration times (configure in `lib/utils.js`)
- **Protected Routes**: All message endpoints require authentication middleware

### Data Protection

- **Environment Variables**: Never commit `.env` files to version control
- **CORS Configuration**: Properly configured to only allow requests from `CLIENT_URL`
- **Input Validation**: Email validation, password length requirements, and field validation in controllers
- **Rate Limiting**: Arcjet middleware protects against brute force attacks and abuse

### Best Practices

1. **Use Strong Secrets**: Generate strong, random strings for `JWT_SECRET`
2. **HTTPS in Production**: Always use HTTPS in production environments
3. **Secure Cookies**: Cookies are set with `secure` flag in production (HTTP-only, SameSite)
4. **Image Upload Security**: Images are validated and uploaded to Cloudinary (not stored on server)
5. **Error Handling**: Generic error messages prevent information leakage
6. **Database Security**: Use MongoDB Atlas with proper access controls and IP whitelisting

### Security Checklist

- [ ] Strong JWT secret key
- [ ] Environment variables not committed to git
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Rate limiting enabled (Arcjet)
- [ ] Password requirements enforced
- [ ] Input validation on all endpoints
- [ ] MongoDB connection secured

## Troubleshooting

### Common Issues

#### MongoDB Connection Error

**Problem:** `MongoDB connection error` or `MONGO_URI is not defined`

**Solutions:**
- Verify `MONGO_URI` is set in `.env` file
- Check MongoDB is running (if local): `mongod` or `brew services start mongodb-community`
- For MongoDB Atlas: Verify connection string format and IP whitelist
- Ensure network connectivity to MongoDB server

---

#### CORS Errors

**Problem:** `Access to fetch blocked by CORS policy`

**Solutions:**
- Verify `CLIENT_URL` in `.env` matches your frontend URL exactly
- Check backend CORS configuration in `backend/src/index.js`
- Ensure backend server is running
- Clear browser cache and cookies

---

#### Socket.io Connection Issues

**Problem:** Real-time messages not working

**Solutions:**
- Verify both backend and frontend servers are running
- Check Socket.io server is initialized in `backend/src/lib/socket.js`
- Verify Socket.io-client is connected in frontend
- Check browser console for connection errors
- Ensure `CLIENT_URL` includes correct port

---

#### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
- Change `PORT` in `.env` to a different port (e.g., 3001)
- Kill process using the port:
  ```bash
  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

---

#### Environment Variables Not Loading

**Problem:** `undefined` values for environment variables

**Solutions:**
- Ensure `.env` file is in `backend` directory (not root)
- Verify `.env` file has correct variable names (check for typos)
- Restart the server after changing `.env` file
- Check `dotenv.config()` is called at the top of `index.js`

---

#### Image Upload Fails

**Problem:** Images not uploading to Cloudinary

**Solutions:**
- Verify Cloudinary credentials in `.env` are correct
- Check Cloudinary dashboard for API key/secret
- Ensure image file size is within limits
- Verify image format is supported (JPEG, PNG, etc.)

---

#### Email Not Sending

**Problem:** Welcome emails not received

**Solutions:**
- Verify Gmail SMTP credentials are correct
- Use App Password (not regular password) for `GOOGLE_SMTP_KEY`
- Enable 2FA on Gmail account
- Check spam folder
- Verify email service is configured in `backend/src/lib/nodemailer.js`

---

#### Authentication Issues

**Problem:** Cannot login or access protected routes

**Solutions:**
- Clear browser cookies
- Verify `JWT_SECRET` is set in `.env`
- Check token generation in `backend/src/lib/utils.js`
- Ensure cookies are being set (check browser DevTools)
- Verify authentication middleware is working

## Project Structure

```
Mersal/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── lib/           # Utilities & configurations
│   │   └── emails/        # Email templates
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── package.json
└── README.md
```
