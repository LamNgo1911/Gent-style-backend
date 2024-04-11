import { NextFunction, Request, Response } from "express";

import categoryService from "../services/categories";
import { BadRequestError } from "../errors/ApiError";

// Todo: Get all categories
export async function getAllCategories(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const categories = await categoryService.getAllCategories();

    response.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
}

// Todo: Get a single category
export async function getSingleCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const id = request.params.id;

    if (!id) {
      throw new BadRequestError("Please provide category id!");
    }

    const category = await categoryService.getSingleCategory(id);

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
    const { name, image } = request.body;

    if (!name || !image) {
      throw new BadRequestError("Please fill out all the fields!");
    }

    const newCategory = await categoryService.createCategory(request.body);

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

    if (!id) {
      throw new BadRequestError("Please provide category id!");
    }

    if (!request.body) {
      throw new BadRequestError("Please provide props to update!");
    }

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

    if (!id) {
      throw new BadRequestError("Please provide category id!");
    }

    const deletedCategory = await categoryService.deleteCategory(id);

    response
      .status(200)
      .json({ message: "Category has been deleted", deletedCategory });
  } catch (error) {
    next(error);
  }
}
