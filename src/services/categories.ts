import { NotFoundError } from "../errors/ApiError";
import { dynamoDB } from "../config/aws-dynamoDB";
import { Category } from "../misc/types";

// Todo: Get all categories
const getAllCategories = async (): Promise<Category[]> => {
  const params = {
    TableName: "Categories",
  };

  const result = await dynamoDB.scan(params).promise();

  if (!result.Items) {
    return [];
  }

  const categories = result.Items as Category[];
  return categories;
};

// Todo: Get a single category
const getSingleCategory = async (id: string): Promise<Category> => {
  const params = {
    TableName: "Categories",
    Key: { id },
  };

  const result = await dynamoDB.get(params).promise();
  const category = result.Item as Category;

  if (!category) {
    throw new NotFoundError(`Category Not Found with id ${id}.`);
  }

  return category;
};

// Todo: Create a new category by admin
const createCategory = async (category: Category): Promise<Category> => {
  const params = {
    TableName: "Categories",
    Item: category,
  };

  await dynamoDB.put(params).promise();
  return category;
};

// Todo: Update a category by admin
const updateCategory = async (
  id: string,
  changedCategory: Partial<Category>
) => {
  const updateExpressions = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  for (const key in changedCategory) {
    updateExpressions.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = (changedCategory as any)[key];
  }

  const params = {
    TableName: "Categories",
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDB.update(params).promise();
  if (!result.Attributes) {
    throw new NotFoundError(`Category Not Found with id ${id}.`);
  }

  return result.Attributes as Category;
};

// Todo: Delete a category by admin
const deleteCategory = async (id: string) => {
  const params = {
    TableName: "Categories",
    Key: { id },
  };

  const result = await dynamoDB.delete(params).promise();
  if (!result) {
    throw new NotFoundError(`Category Not Found with id ${id}.`);
  }
};

export default {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
