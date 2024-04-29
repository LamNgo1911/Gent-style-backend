import { FilterQuery, SortOrder } from "mongoose";

import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Product, { ProductDocument } from "../models/Product";

// Todo: Get all products
const getAllProducts = async (
  query: FilterQuery<ProductDocument>,
  sortQuery: { [key: string]: SortOrder },
  skip: number,
  limit: number
): Promise<[ProductDocument[], number]> => {
  const products = await Product.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .populate("category");

  const count = await Product.countDocuments(query);

  return [products, count];
};

// Todo: Get a single product
const getSingleProduct = async (id: string): Promise<ProductDocument> => {
  const product = await Product.findById(id).populate("category");

  if (!product) {
    throw new NotFoundError(`Product Not Found wit product id ${id}.`);
  }

  return product;
};

// Todo: Create a new product
const createProduct = async (
  product: ProductDocument
): Promise<ProductDocument> => {
  return await product.save();
};

// Todo: Update a product
const updateProduct = async (
  id: string,
  changedProduct: Partial<ProductDocument>
) => {
  const options = { new: true, runValidators: true };

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    changedProduct,
    options
  );

  if (!updatedProduct) {
    throw new BadRequestError(`Product Not Found wit product id ${id}.`);
  }

  return updatedProduct;
};

// Todo: Delete a product
const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new BadRequestError(`Product Not Found wit product id ${id}.`);
  }

  return product;
};

export default {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
