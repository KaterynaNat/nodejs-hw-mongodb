import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Swagger
  const swaggerFile = fs.readFileSync('./docs/openapi.yaml', 'utf8');
  const swaggerDocument = yaml.parse(swaggerFile);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(pino());

  // Routes
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}
