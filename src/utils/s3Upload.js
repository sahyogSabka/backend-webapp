const AWS = require("aws-sdk");

// Configure the AWS SDK
AWS.config.update({
  accessKeyId: process.env.MYAPP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MYAPP_AWS_SECRET_ACCESS_KEY,
  region: process.env.MYAPP_AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadFileToS3(fileBuffer, fileName, mimeType, bucketName = "sahyog-sabka/foodItem") {
  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}-${fileName?.split(' ')?.join('-')}`, // File name you want to save as in S3
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const s3Response = await s3.upload(params).promise();
  return s3Response;
}

module.exports = { uploadFileToS3 };
