const mongoose = require('mongoose');

function mongoValidationError(error, msg) {
    if (error instanceof mongoose.Error.ValidationError) {
        return { message: error.message };
    } else if (error.code === 11000) {
        // Duplicate key error
        const field = Object.keys(error.keyValue)[0]; // Get the field that caused the error
        return { message: msg || `${field} already exists` };
    } else {
        // Handle other types of errors if necessary
        return { message: 'An unknown error occurred' };
    }
}

module.exports = { mongoValidationError }