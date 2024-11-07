# E-Commerce Backend

- This is the backend server for an e-commerce website built using Node.js, TypeScript, and Express.js. It provides the API endpoints and handles the business logic for managing users, categories, products, cart items, and orders.

## Table of Contents

- Features
- Requirements
- Getting Started
- API Endpoints
- Environment Variables
- Database
- Authentication
- Error Handling
- Testing
- Linting and Formatting
- Deployment
- Contributing
- License

## Features

- User registration and authentication
- Category management (CRUD operations)
- Product management (CRUD operations)
- Cart item management (CRUD operations)
- Order management (CRUD operations)

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB database (v4 or higher)

## Getting Started

1. Clone the repository:

- git clone https://github.com/LamNgo1911/Gent-Style-Backend.git

2. Install the dependencies:

- cd Gent-Style-Backend
- npm install

3. Set up the environment variables (see Environment Variables).
4. Start the server:

- npm run dev

## API Endpoints

1. Users

- POST /users/register: Create a new user.
- POST /users/login: Login a user.
- POST /users/forgot-password: Send a verification link to the user's email for password reset.
- POST /users/reset-password: Reset the user's password.
- POST /users/google-authenticate: Authenticate a user using Google login.
- GET /users/:id: Get a single user.
- PUT /users/:id/update-password: Update user password.
- PUT /users/:id: Update a user.
- GET /admin/users: Get all users (admin-only route).
- GET /admin/users/:id: Get a single user by admin.
- PUT /admin/users/:id/update-password: Update user password by admin.
- PUT /admin/users/:id: Update a user by admin.
- DELETE /admin/users/:id: Delete a user by admin.

2. Categories

- GET /: Get all categories.
- GET /:id: Get a single category.
- POST /: Create a new category by admin.
- PUT /:id: Update a category by admin.
- DELETE /:id: Delete a category by admin

3. Products

- GET /products: Get all products.
- GET /products/:id: Get a single product.
- POST /products: Create a new product by admin.
- PUT /products/:id: Update a product by admin.
- DELETE /products/:id: Delete a product by admin.

4. CartItems

- GET /cartItems: Get all cart items by user.
- GET /cartItems/:id: Get a single cart item.
- POST /cartItems: Create a new cart item by admin.
- PUT /cartItems/:id: Update a cart item by admin.
- DELETE /cartItems/:id: Delete a cart item by admin.

5. Orders

- POST /orders: Create a new order.
- GET /orders/:orderId: Get an order by ID.
- GET /orders/users: Get all orders by user ID.
- GET /orders: Get all orders (admin-only route).
- PUT /orders/:orderId: Update an order by admin.
- DELETE /orders/:orderId: Delete an order by admin.

## Environment Variables

The following environment variables are required:

- PORT: The port on which the server will run. Default is 8080.
- MONGO_DB_URL: The URL to connect to your MongoDB database.
- GOOGLE_CLIENT_ID: The Client ID for Google OAuth authentication.
- GOOGLE_CLIENT_SECRET: The Client Secret for Google OAuth authentication.
- JWT_SECRET: The secret key used for JSON Web Token (JWT) signing and verification.
- JWT_EXPIRES_IN: The expiration time for JWTs. Default is 30d (30 days).
- NODEMAILER_PASSWORD: The password for the email account used for sending emails via Nodemailer.
