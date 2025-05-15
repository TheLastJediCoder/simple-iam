import { Options } from 'swagger-jsdoc';

const swaggerDefinition: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple IAM API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Simple Identity and Access Management (IAM) service.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Replace with your actual server URL
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing API routes and JSDoc comments
  apis: [
    './src/controllers/*.ts', // Adjust the path to your controller files
    './src/dtos/*.ts', // Optionally include DTOs if you use JSDoc for schemas
  ],
};

export default swaggerDefinition;