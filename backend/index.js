import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js'
import staffRoutes from './routes/staff.js';
import userRoutes from './routes/user.js';
import { getMetricsSummary } from './controllers/admin.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: ["https://cms-nine-olive.vercel.app", "http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "userid"],
    })
);

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true);

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/user", userRoutes);
app.get("/api/metrics/summary", getMetricsSummary);

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});