import fs from "fs";
import path from "path";

import { BadRequestError } from "../errors/ApiError";
import { s3 } from "../config/aws-s3";

// Todo: Upload images to Cloudinary
async function uploadImages(files: Express.Multer.File[]): Promise<string[]> {
  const uploadedImages: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.mimetype.startsWith("image")) {
      throw new BadRequestError(`File ${i + 1} is not an image`);
    }

    const fileContent = fs.readFileSync(file.path);
    const fileName = `${Date.now()}-${path.basename(file.path)}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype,
      ACL: "public-read", // Allow read access to this file
    };

    try {
      const data = await s3.upload(params).promise();
      uploadedImages.push(data.Location);
      fs.unlinkSync(file.path); // Remove the file from the local filesystem
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Error uploading image");
    }
  }

  return uploadedImages;
}

export { uploadImages };
