import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { BadRequestError } from "../errors/ApiError";
import { s3 } from "../config/aws-s3";

dotenv.config();

// Todo: Upload images to S3
async function uploadImages(files: Express.Multer.File[]): Promise<string[]> {
  const uploadedImages: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.mimetype.startsWith("image")) {
      throw new BadRequestError(`File ${i + 1} is not an image`);
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await s3.upload(params).promise();
      uploadedImages.push(data.Location);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Error uploading image");
    }
  }

  return uploadedImages;
}

export { uploadImages };
