import fs from "fs";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../src/config/cloudinary";
import { uploadImages } from "../../src/utils/imageUpload";
import { Readable } from "stream";

jest.mock("fs"); // Mock the fs module

describe("uploadImages", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should upload images to Cloudinary and return the secure URLs", async () => {
    const hexString = "aabbccddeeff";
    const buffer = Buffer.from(hexString, "hex");

    const files: Express.Multer.File[] = [
      {
        mimetype: "image/jpeg",
        path: "/path/to/image1.jpg",
        fieldname: "",
        originalname: "",
        encoding: "",
        size: 0,
        stream: new Readable(),
        destination: "",
        filename: "",
        buffer,
      },
    ];

    const mockUploadResult: UploadApiResponse = {
      secure_url: "https://example.com/image.jpg",
      public_id: "",
      version: 0,
      signature: "",
      width: 0,
      height: 0,
      format: "",
      resource_type: "image",
      created_at: "",
      tags: [],
      pages: 0,
      bytes: 0,
      type: "",
      etag: "",
      placeholder: false,
      url: "",
      access_mode: "",
      original_filename: "",
      moderation: [],
      access_control: [],
      context: {},
      metadata: {},
    };

    jest
      .spyOn(cloudinary.uploader, "upload")
      .mockResolvedValue(mockUploadResult);
    jest.spyOn(fs, "unlinkSync").mockImplementation(jest.fn());

    const uploadedImages = await uploadImages(files);

    expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(files.length);
    expect(fs.unlinkSync).toHaveBeenCalledTimes(files.length);
    expect(uploadedImages).toEqual([mockUploadResult.secure_url]);
  });
});
