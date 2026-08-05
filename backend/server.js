import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import extractRouter from './routes/extract.js';
import generateRouter from './routes/generate.js';


const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/extract', extractRouter);
app.use('/api/generate', generateRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
