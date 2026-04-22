import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: ["https://xpensetrack.onrender.com", "http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "userid"],
    })
);

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true);

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});