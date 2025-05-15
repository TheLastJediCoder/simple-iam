// Import necessary libraries and modules
import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Import route handlers from controllers
import { userRouter } from './controllers/user.controller';
import { authRouter } from './controllers/auth.controller';
import { scopeRouter } from './controllers/scope.controller';
import { roleRouter } from './controllers/role.controller';

// Import custom middleware for token validation
import validateToken from './middleware/auth.middleware';

// Create an Express application instance
const app = express();
// Define the port number for the server, defaulting to a value from environment variables
const PORT = process.env.PORT;

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Simple IAM API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Simple IAM application',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`, // Adjust if your app is hosted elsewhere
    },
  ],
};

// Configure Winston for general application logging
const logger = winston.createLogger({
  level: 'info', // Log level (e.g., 'info', 'warn', 'error')
  format: winston.format.combine(
    winston.format.colorize(), // Add colors to log output
    winston.format.simple(), // Simple log format
  ),
  transports: [
    // Log to the console
    new winston.transports.Console(),
  ],
});

// Use Morgan middleware for request logging in a development-friendly format
app.use(morgan('dev'));

// Apply middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple health check endpoint
app.get('/health-check', (req, res) => {
  res.send('Simple IAM Health Check');
});

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/controllers/*.ts'], // Path to the API docs (e.g. routes, controllers)
};
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJsdoc(options);
// Serve swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Mount route handlers for different paths
// The auth router does not require token validation
app.use('/auth', authRouter);
// The following routes require token validation using the `validateToken` middleware
app.use('/users', validateToken, userRouter);
app.use('/scopes', validateToken, scopeRouter);
app.use('/roles', validateToken, roleRouter);

// Handle graceful shutdown on SIGTERM signal (used in some deployment environments)
process.on('SIGTERM', async () => {
  process.exit(0);
});

// Handle graceful shutdown on SIGINT signal (e.g., Ctrl+C in development)
process.on('SIGINT', async () => {
  process.exit(0);
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  logger.info(`Simple IAM running on port ${PORT}`);
});
