
import 'dotenv/config';


import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import passport from './config/passport.js';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
    credentials: true
}));
app.use(cookieParser());
app.use(passport.initialize());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import lostItemRoutes from './routes/lostItemRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/lost-and-found', lostItemRoutes);
app.use('/api/chat', chatRoutes);
import rideRoutes from './routes/rideRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import confessionRoutes from './routes/confessionRoutes.js';
app.use('/api/rides', rideRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/buzz', confessionRoutes);

app.get('/', (req, res) => {
    res.send('Stuverse API is running');
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.CLIENT_URL || "http://localhost:5173"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData.name + " joined chat: " + userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User joined Room: ' + room);
    });

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved;

        if (!chat.recipient) return console.log('chat.recipient not defined');

        socket.in(chat.recipient._id).emit('message received', newMessageRecieved);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

httpServer.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
