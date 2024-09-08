const multer = require('multer');

// Configure memory storage (no files saved to disk)
const storage = multer.memoryStorage(); // Store files in memory

// Create the Multer instance with the memory storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
