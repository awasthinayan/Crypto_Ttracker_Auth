import express from 'express';
import { PORT } from './src/Config/serverConfig.js';
import connectDB from './src/Config/DBConfig.js';
import Routes from './src/Routes/UserRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://coin-gecko-tracker-rho.vercel.app',
      'https://coin-gecko-tracker-p74jhdlv1-nayan-awasthis-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

connectDB();

app.use('/v1/api', Routes);

app.get('/debug/env', (req, res) => {
  res.json({
    brevo: process.env.BREVO_API_KEY ? 'SET' : 'NOT SET',
    port: process.env.PORT
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
