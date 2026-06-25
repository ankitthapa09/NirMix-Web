// this handles the MongoDb connection using mongoose 
// Includes retry logic, connection events, and graceful shutdown


import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5; // try connecting up to 5 times 
const RETRY_DELAY = 3000; // 3 seconds delay between retries

export const connectDB = async (): Promise<void> => {
  const mongoUri = env.MONGODB_URI;

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      } as mongoose.ConnectOptions);

      console.log(`MongoDB connected: ${conn.connection.host}`);
      console.log(`Database: ${conn.connection.name}`);
      return;
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`,
        (error as Error).message
      );
      if (attempt >= MAX_RETRIES) {
        console.error("All MongoDB connection attempts failed. Shutting down.");
        process.exit(1);
      }
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

    }
  }
};

// These fire automatically when the connection state changes
mongoose.connection.on("connected", () => {
  console.log("Mongoose connection established");
});
mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose reconnected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});