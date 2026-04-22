import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectdb } from './lib/db.js' ;  
import cookieParser from "cookie-parser"
import cors from 'cors';
import path from 'path';
//changes 

dotenv.config();

const app= express();
const PORT=process.env.PORT;

const __dirname = path.resolve();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://streamyy-ni4b.vercel.app",
        "https://streamyy.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
    });
}

// Only listen if not running as a Vercel function
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on this port ${PORT}`);
        connectdb();
    });
} else {
    // In serverless, we should still trigger the DB connection
    connectdb();
}

export default app;