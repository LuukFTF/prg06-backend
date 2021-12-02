require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const songsRouter = require('./routes/songsRoutes')

// Mondodb connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

// Middleware
app.use('/', songsRouter);

app.get('/ping', (req, res) => {
    try {
        res.status(200).json({ message: "pong!"})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
});

// Start Port Listening
app.listen(process.env.PORT, () => console.log(`Server Started on port ${process.env.PORT}`))