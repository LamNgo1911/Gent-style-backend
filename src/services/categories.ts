import { BadRequestError, NotFoundError } from "../errors/ApiError";
import Category, { CategoryDocument } from "../models/Category";

// Todo: Get all categories
const getAllCategory = async (): Promise<CategoryDocument[]> => {
  return await Category.find();
};

// Todo: Get a single category
const getOneCategory = async (id: string): Promise<CategoryDocument> => {
  if (!id) {
    throw new BadRequestError("Please provide category id!");
  }

  const category = await Category.findById(id);

  if (category) {
    return category;
  }

  throw new NotFoundError(`Category Not Found with id ${id}.`);
};

// Todo: Create a new category by admin
const createCategory = async (
  category: CategoryDocument
): Promise<CategoryDocument> => {
  const { name, image } = category;

  if (!name || !image) {
    throw new BadRequestError("Please fill out all the fields!");
  }

  return await category.save();
};

// Todo: Update a category by admin
const updateCategory = async (
  id: string,
  changedCategory: Partial<CategoryDocument>
) => {
  if (!id) {
    throw new BadRequestError("Please provide category id!");
  }
  if (!changedCategory) {
    throw new BadRequestError("Please provide props to update!");
  }

  const options = { new: true, runValidators: true };

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    changedCategory,
    options
  );

  if (updatedCategory) {
    return updatedCategory;
  }

  throw new NotFoundError(`Category No Found with category id ${id}`);
};

// Todo: Delete a category by admin
const deleteCategory = async (id: string) => {
  if (!id) {
    throw new BadRequestError("Please provide category id!");
  }

  const category = await Category.findByIdAndDelete(id);

  if (category) {
    return category;
  }

  throw new NotFoundError(`Category Not Found with id ${id}.`);
};

export default {
  getAllCategory,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
