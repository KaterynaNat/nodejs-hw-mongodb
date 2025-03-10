import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = getEnvVar('PORT', 3000);

export async function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  
  app.use(pino({
    transport: {
      target: 'pino-pretty',
    },
  }));

  app.use('/contacts', contactsRouter);

  app.get('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
