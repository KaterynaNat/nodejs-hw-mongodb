import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(
    cors({
      origin: ['http://127.0.0.1:3000', 'https://swagger-orjw.onrender.com'],
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(pino());

  // Swagger
  app.use('/api-docs', swaggerDocs());

  // Routes
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://127.0.0.1:${PORT}/api-docs`);
  });
}
