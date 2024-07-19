// Import necessary AWS SDK clients and commands
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Function to extract object key from an S3 object URL
const parseS3Url = (url) => {
  const urlObject = new URL(url);
  const objectKey = urlObject.pathname.slice(1);
  return { objectKey };
};

// Function to generate a signed URL from an S3 object URL
const generateSignedUrlFromS3Url = async (s3Url, bucketName) => {
  // Parse the S3 URL to get bucket name and object key
  const { objectKey } = parseS3Url(s3Url);

  // Initialize the S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY, // Replace with your access key
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your secret key
    },
  });

  const commandParams = {
    Bucket: bucketName,
    Key: objectKey,
  };

  // Create the command
  const command = new GetObjectCommand(commandParams);

  // Generate the signed URL
  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    }); // URL expires in 1 hour
    console.log("Signed URL:", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
  }
};

module.exports = { generateSignedUrlFromS3Url };
