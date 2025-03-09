import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const db = getEnvVar('MONGODB_DB');
    const name = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');

    const mongoUri = `mongodb+srv://${name}:${password}@cluster0.zyv54.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(mongoUri);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
    throw error;
  }
};
