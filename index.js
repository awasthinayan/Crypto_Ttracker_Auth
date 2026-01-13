import express from 'express';
import { PORT } from './src/Config/serverConfig.js';
import connectDB from './src/Config/DBConfig.js';
import Routes from './src/Routes/UserRoute.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://coin-gecko-tracker-f6ssnhbbg-nayan-awasthis-projects.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

connectDB();

app.use('/V1/api', Routes);

app.get('/', (req, res) => {
  res.send('Hello World the server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
