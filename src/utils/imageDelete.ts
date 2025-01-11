import { s3 } from "../config/aws-s3";
import dotenv from "dotenv";

dotenv.config();

async function deleteImage(fileName: string): Promise<void> {
  const url = new URL(fileName);
  console.log(`URL:`, url);
  const objectKey = url.pathname.substring(1);
  console.log(`Object Key:`, objectKey);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: objectKey,
  };

  try {
    console.log(
      `Attempting to delete image: ${fileName} from bucket: ${process.env.S3_BUCKET_NAME}`
    );
    const data = await s3.deleteObject(params).promise();
    console.log(`DeleteObject response data:`, data);
    console.log(`Image ${fileName} deleted successfully`);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Error deleting image");
  }
}

export { deleteImage };
