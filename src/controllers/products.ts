import { Request, Response, NextFunction } from "express";
import { FilterQuery, SortOrder } from "mongoose";

import Product from "../models/Product";
import productsService from "../services/products";
import { ProductDocument } from "../models/Product";
import { BadRequestError } from "../errors/ApiError";
import { uploadImages } from "../utils/imageUpload";

// Todo: Get all products
export async function getAllProducts(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const limit = Number(request.query?.limit) || 8;
    const skip = Number(request.query?.skip) || 0;
    const priceMin = Number(request.query?.priceMin);
    const priceMax = Number(request.query?.priceMax);
    const { sort, category, size, color, search } = request.query;

    const query: FilterQuery<ProductDocument> = {};
    const sortQuery: { [key: string]: SortOrder } = {};

    // Todo: sort products
    if (sort === "Latest added") {
      sortQuery.createdAt = -1;
    } else if (sort === "Most relevant") {
      sortQuery.createdAt = 1;
    } else if (sort === "Lowest price") {
      sortQuery.price = 1;
    } else if (sort === "Highest price") {
      sortQuery.price = -1;
    }

    // Todo: Filter products by category
    if (category && category !== "All") {
      // const cate = await Category.findOne({ name: category });
      // if (cate) {
      //   query.category = cate._id;
      // }
    }

    // Todo:  Filter products by price
    if (priceMin && priceMax) {
      query.price = { $gte: priceMin, $lte: priceMax };
    } else if (priceMin) {
      query.price = { $gte: priceMin };
    } else if (priceMax) {
      query.price = { $lte: priceMax };
    }

    // Todo: Filter products by size and color
    if (size && color) {
      query["variants.color"] = color;
      query["variants.size"] = size;
    } else if (size) {
      // Todo: Filter products by size only
      query["variants.size"] = size;
    } else if (color) {
      // Todo: Filter products by color only
      query["variants.color"] = color;
    }

    // Todo:  Filter products by search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const [products, count] = await productsService.getAllProducts(
      query,
      sortQuery,
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

    response.status(200).json({ product });
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
      !variants ||
      variants.length === 0
    ) {
      throw new BadRequestError("Please fill out all fields!");
    }
    // const checkedCategory = await Category.findOne({ _id: category });

    // if (!checkedCategory) {
    //   throw new BadRequestError("Category Not Found");
    // }
    const uploadedImages = await uploadImages(files);

    const productData = new Product({
      name,
      price,
      description,
      category,
      variants,
      images: uploadedImages,
    });

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
