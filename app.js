// Import packages
const express = require('express');
const mongoose = require('mongoose');
const apiRoute = require('./src/apiRoute');

// create app
const app = express();

// data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// api route
app.use('/api/posts', apiRoute);

// config variables
const PORT = process.env.PORT || 5050;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/TestDB'

// database connection
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('\033[32mDatabase connected with MongoDB');
    // server listening
    app.listen(PORT, () => {
        console.log(`Server is listening on${'\033[0m'} ${'\033[33m'}http://127.0.0.1:${PORT}${'\033[0m'}`);
    });
})