import { NextFunction, Request, Response } from "express";

import Category from "../models/Category";
import categoryService from "../services/categories";

// Todo: Get all categories
export async function getAllCategory(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const categories = await categoryService.getAllCategory();

    response.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
}

// Todo: Get a single category
export async function getOneCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const category = await categoryService.getOneCategory(request.params.id);

    response.status(201).json({ category });
  } catch (error) {
    next(error);
  }
}

// Todo: Create a new category by admin
export async function createCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const category = new Category(request.body);
    const newCategory = await categoryService.createCategory(category);

    response.status(201).json({ newCategory });
  } catch (error) {
    next(error);
  }
}

// Todo: Update a category by admin
export async function updateCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;

    const updatedCategory = await categoryService.updateCategory(
      id,
      request.body
    );

    response.status(200).json({ updatedCategory });
  } catch (error) {
    next(error);
  }
}

// Todo: Delete a category by admin
export async function deleteCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;
    const deletedCategory = await categoryService.deleteCategory(id);

    response
      .status(200)
      .json({ message: "Category has been deleted", deletedCategory });
  } catch (error) {
    next(error);
  }
}
