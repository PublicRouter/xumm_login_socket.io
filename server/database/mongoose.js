const mongoose = require('mongoose');
require('dotenv').config();

console.log(process.env.MONGODB_URI);

function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        console.log("mongoose connection already established.");
        return mongoose.connection.asPromise(); // Note: .asPromise() is not a method on mongoose connection object
    } else {
        const uri = process.env.MONGODB_URI;
        console.log("mongoose connection created.");
        return mongoose.connect(uri);
    };
};

module.exports = mongooseConnect;
