const mongoose = require('mongoose');

// Accessing ObjectId from Mongoose
const ObjectId = mongoose.Types.ObjectId;

// Function to safely create ObjectId from string
function createObjectId(id, errMsg='Invalid ObjectId format') {
    if (ObjectId.isValid(id)) {
        return new ObjectId(id);
    } else {
        throw new Error(errMsg);
    }
}

module.exports = { createObjectId }