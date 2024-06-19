const crypto = require('crypto');

function createSecretKey() {
    return crypto.randomBytes(64).toString('hex');
}

module.exports = { createSecretKey }