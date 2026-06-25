import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './src/config/db.js'; // Note the .js extension required for NodeNext module resolution
import 'dotenv/config';

const PORT = Number(process.env.PORT) || 6000;
const app: Express = express();

// ============== MIDDLEWARE ==============

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============== ROUTES ==============

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// ============== START SERVER ==============

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();
