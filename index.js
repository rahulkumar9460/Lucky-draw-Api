const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoute = require('./routes/auth');
const homeRoute = require('./routes/home');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true},
    () => console.log('Connected to Db')
);

app.use(express.json());


app.use('/api/user', authRoute);
app.use('/api/user', homeRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Surver up and running'));