import { NotFoundError } from "../errors/ApiError";
import Category, { CategoryDocument } from "../models/Category";

// Todo: Get all categories
const getAllCategories = async (): Promise<CategoryDocument[]> => {
  return await Category.find();
};

// Todo: Get a single category
const getSingleCategory = async (id: string): Promise<CategoryDocument> => {
  const category = await Category.findById(id);

  if (!category) {
    throw new NotFoundError(`Category Not Found with id ${id}.`);
  }

  return category;
};

// Todo: Create a new category by admin
const createCategory = async (
  category: CategoryDocument
): Promise<CategoryDocument> => {
  return await category.save();
};

// Todo: Update a category by admin
const updateCategory = async (
  id: string,
  changedCategory: Partial<CategoryDocument>
) => {
  const options = { new: true, runValidators: true };

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    changedCategory,
    options
  );

  if (!updatedCategory) {
    throw new NotFoundError(`Category No Found with category id ${id}`);
  }

  return updatedCategory;
};

// Todo: Delete a category by admin
const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);

  if (category) {
    return category;
  }

  throw new NotFoundError(`Category Not Found with id ${id}.`);
};

export default {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
