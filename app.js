
// app.js
const express = require('express');
const cors = require('cors'); // Import cors for handling cross-origin requests
const mongoose = require('mongoose');
require('dotenv').config();

const tokenRoutes = require('./router/tokenRouter');
const walletRoutes = require('./router/walletRouter');
const authRoutes = require('./router/authRouter'); // Import auth routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173' , 'http://etherna.vip']
  })) 

// Simple GET route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Routes
app.use('/api/v2/token', tokenRoutes);
app.use('/api/v2/wallet', walletRoutes);
app.use('/api/v2/auth', authRoutes); // Use Auth Routes



// Start the server
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => console.log(err));
