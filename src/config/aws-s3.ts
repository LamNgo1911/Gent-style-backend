import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
