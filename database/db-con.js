require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGO_URL;
console.log(url);

const databaseConnection = mongoose.connect(url)
    .then(() => {
        console.log("DB connect")
    })
    .catch(() => {
        console.log("DB failed")
    })

module.exports = databaseConnection;