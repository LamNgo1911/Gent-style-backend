import request from "supertest";
import connect, { MongoHelper } from "../db-helper";
import Category from "../../src/models/Category";
import categoryService from "../../src/services/categories";

// createCategory
async function createCategory() {
  const category = new Category({ name: "category1", image: "###" });
  return await categoryService.createCategory(category);
}

//tear down
describe("Category controller test", () => {
  // connect database
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  // test suit
  // Todo: Get all categories
  it("should return list of categories", async () => {
    // create new category
    await createCategory();

    // check category list
    const categoryList = await categoryService.getAllCategories();
    expect(categoryList.length).toEqual(1);
    expect(categoryList[0]).toHaveProperty("name");
  });

  // Todo: Get a single category
  it("should get a single a category", async () => {
    // create new category
    const newCategory = await createCategory();

    // check category list
    const category = await categoryService.getSingleCategory(newCategory.id);
    expect(category).toHaveProperty("name");
  });

  // Todo: Create category
  it("should create a category", async () => {
    const newCategory = await createCategory();
    expect(newCategory).toHaveProperty("_id");
    expect(newCategory).toHaveProperty("name");
  });

  // Todo: Update a category
  it("should update a category", async () => {
    // create new category
    const newCategory = await createCategory();

    // check category list
    const category = await categoryService.updateCategory(newCategory.id, {
      name: "Haha",
    });
    expect(category.name).toBe("Haha");
  });

  // Todo: Delete a category
  it("should delete a category", async () => {
    // create new category
    const newCategory = await createCategory();

    // check category list
    const category = await categoryService.deleteCategory(newCategory.id);
    expect(category).toHaveProperty("name");
  });
});
