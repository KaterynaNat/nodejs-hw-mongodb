import dotenv from 'dotenv';
dotenv.config();

import pino from 'pino-http';
import cors from 'cors';

import express from 'express';

import { getAllContacts } from './services/getAllContacts.js';
import { getContactById } from './services/getContactById.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = getEnvVar('PORT', 3000);

export async function setupServer() {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({ message: 'Not found' });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const id = req.params.id;
    const contact = await getContactById(id);
    if (contact === null) {
      res.status(404).json({
        message: 'Contact not found',
      });
    } else {
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
      });
    }
  });

  app.get('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
