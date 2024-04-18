import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";

import Product from "../models/Product";
import productsService from "../services/products";
import { ProductDocument } from "../models/Product";
import { BadRequestError } from "../errors/ApiError";
import Category from "../models/Category";
import { SortOptions, Variant } from "../misc/types";
import { uploadImages } from "../services/imageUpload";

// Todo: Get all products
export async function getAllProducts(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const page = Number(request.query?.page) || 1;
    const limit = Number(request.query?.limit) || 8;
    const {
      sort,
      category,
      priceOption,
      lowestPrice,
      highestPrice,
      size,
      color,
      search,
    } = request.query;

    const skip = (page - 1) * limit;
    const query: FilterQuery<ProductDocument> = {};

    // Todo: sort products
    const sortOptions: SortOptions = {
      "Latest added": { createdAt: -1 },
      "Most relevant": { createdAt: -1 },
      "Lowest price": { price: 1 },
      "Highest price": { price: -1 },
      "Top reviews": { averageRating: -1 },
    };

    if (sort && sortOptions[sort as keyof SortOptions]) {
      query.sort = sortOptions[sort as keyof SortOptions];
    }

    // Todo: Filter products by category
    if (category && category !== "All category" && category !== "All") {
      const cate = await Category.findOne({ name: category });
      if (cate) {
        query.category = cate._id;
      }
    }

    // Todo:  Filter products by price
    if (priceOption === "Custom") {
      if (lowestPrice && highestPrice) {
        query.price = { $gte: lowestPrice, $lte: highestPrice };
      } else if (lowestPrice) {
        query.price = { $gte: lowestPrice };
      } else if (highestPrice) {
        query.price = { $lte: highestPrice };
      }
    }

    // Todo: Filter products by size and color
    if (size && color) {
      query.variants = {
        $elemMatch: {
          size,
          color,
        },
      };
    } else if (size) {
      // Todo: Filter products by size only
      query.variants = {
        $elemMatch: {
          size,
        },
      };
    } else if (color) {
      // Todo: Filter products by color only
      query.variants = {
        $elemMatch: {
          color,
        },
      };
    }

    // Todo:  Filter products by search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    console.log(query);
    const [products, count] = await productsService.getAllProducts(
      query,
      skip,
      limit
    );

    response.status(200).json({ products, count });
  } catch (error) {
    next(error);
  }
}

// Todo: Get a single product
export async function getSingleProduct(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide product id!");
    }

    const product = await productsService.getSingleProduct(id);

    response.status(201).json({ product });
  } catch (error) {
    next(error);
  }
}

// Todo: Create a new product
export async function createProduct(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, price, description, category, variants } = request.body;
    const files = request.files as Express.Multer.File[];

    if (
      !name ||
      !price ||
      !description ||
      !category ||
      files.length === 0 ||
      variants.length === 0
    ) {
      throw new BadRequestError("Please fill out all fields!");
    }

    const checkedCategory = await Category.findOne({ _id: category });

    if (!checkedCategory) {
      throw new BadRequestError("Category Not Found");
    }
    const uploadedImages = await uploadImages(files);
    console.log(uploadedImages, variants);

    const variantData = variants.map((variant: Variant) => {
      const variantImages = uploadedImages.splice(0, variant.color.countImages);
      return {
        ...variant,
        color: {
          ...variant.color,
          images: variantImages,
        },
      };
    });
    const productData = new Product({
      name,
      price,
      description,
      category,
      variants: variantData,
    });
    console.log(variantData);

    const newProduct = await productsService.createProduct(productData);

    response.status(201).json({ newProduct });
  } catch (error) {
    next(error);
  }
}

// Todo: Update a product
export async function updateProduct(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide product id!");
    }

    const product: Partial<ProductDocument> = request.body;

    const updatedProduct = await productsService.updateProduct(id, product);

    response
      .status(200)
      .json({ message: "Product has been updated", updatedProduct });
  } catch (error) {
    next(error);
  }
}

// Todo: Delete a product
export async function deleteProduct(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide product id!");
    }

    const deletedProduct = await productsService.deleteProduct(id);

    response
      .status(200)
      .json({ message: "Product has been deleted", deletedProduct });
  } catch (error) {
    next(error);
  }
}
