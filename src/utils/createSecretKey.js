// const crypto = require('crypto');

function createSecretKey() {
    // let createUniqueStr = crypto.randomBytes(64).toString('hex')
    return process.env.JWT_SECRET_KEY;
}

module.exports = { createSecretKey }