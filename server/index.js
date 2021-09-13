require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-app.vlu4w.mongodb.net/mern-app?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err);
    }
}

connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => console.log(`Server started on port ${PORT}`));