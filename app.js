// Import packages
const express = require('express');
const mongoose = require('mongoose');
const apiRoute = require('./src/apiRoute');
const { networkInterfaces } = require('os')

// create app
const app = express();

// data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// api route
app.use('/api/posts', apiRoute);

// get local IP address
const NIF = networkInterfaces();
let IP_ADDRESS;
for (let name of Object.keys(NIF)) {
    for (let net of NIF[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            IP_ADDRESS = net.address
        }
    }
}

// config variables
const PORT = process.env.PORT || 5050
    , DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/TestDB';

// database connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('\033[32mDatabase connected with MongoDB\033[0m');
    // server listening
    app.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}${'\033[0m'}`);
        console.log(`Local Network: ${'\033[33m'}http://${'127.0.0.1'}:${PORT}/${'\033[0m'}`);
        console.log(`Your Network:  ${'\033[33m'}http://${IP_ADDRESS}:${PORT}/${'\033[0m'}`);
    });
})
