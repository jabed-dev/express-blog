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
const port = process.env.PORT || 5050
    , hostname = '127.0.0.1'
    , dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/TestDB';

// database connection
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('\033[32mDatabase connected..');
    // server listening
    app.listen(port, hostname, () => {
        console.log(`Server running on${'\033[0m'} ${'\033[33m'}http://${hostname}:${port}/${'\033[0m'}`);
    });
})
