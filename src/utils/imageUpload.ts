import { UploadApiResponse } from "cloudinary";
import fs from "fs";

import { BadRequestError } from "../errors/ApiError";
import cloudinary from "../config/cloudinary";

// Todo: Upload images to Cloudinary
async function uploadImages(files: Express.Multer.File[]): Promise<string[]> {
  const uploadedImages: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.mimetype.startsWith("image")) {
      throw new BadRequestError(`File ${i + 1} is not an image`);
    }

    try {
      const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
        file.path
      );
      uploadedImages.push(uploadResult.secure_url);
      fs.unlinkSync(file.path);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Error uploading image");
    }
  }

  return uploadedImages;
}

export { uploadImages };
