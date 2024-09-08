const AWS = require("aws-sdk");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink); // Promisify fs.unlink for easier async/await usage

// Configure the AWS SDK
AWS.config.update({
  accessKeyId: process.env.MYAPP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MYAPP_AWS_SECRET_ACCESS_KEY,
  region: process.env.MYAPP_AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadFileToS3(file, bucketName = "sahyog-sabka/foodItem") {
    const fileContent = fs.readFileSync(file.path); // Read file from disk
  
    const params = {
      Bucket: bucketName,
      Key: `${Date.now()}-${file.originalname?.split(' ')?.join('-')}`, // File name you want to save as in S3
      Body: fileContent,
      ContentType: file.mimetype,
    };
  
    const s3Response = await s3.upload(params).promise();
    await unlinkFile(file.path); // Delete the file from local storage
    return s3Response;
  }

module.exports = { uploadFileToS3 };
