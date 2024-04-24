import { SuperTest, Test } from "supertest";
import request, { Response } from "supertest";
import path from "path";
import app from "../../src/app";
import connect, { MongoHelper } from "../db-helper";
import { createCategory, createUser, getAccess_token } from "../commonUse";
import { CategoryDocument } from "../../src/models/Category";

// jest.useFakeTimers();

const filePath = path.resolve(__dirname, "sample-asset", "image.png");

describe("Product controller test", () => {
  let mongoHelper: MongoHelper;
  let access_token: string;
  let agent: request.SuperTest<request.Test>;
  let newCategory: CategoryDocument;

  beforeAll(async () => {
    mongoHelper = await connect();
    agent = request(app) as unknown as SuperTest<Test>;

    const userinfo = await createUser(
      "user1@gmail.com",
      "123lam",
      "ADMIN",
      "Lam"
    );

    const userData = await getAccess_token(
      userinfo.body.newUser.email,
      "123lam"
    );
    access_token = userData.body.access_token;

    newCategory = (await createCategory("Jacket", filePath, access_token)).body
      .newCategory;
  });

  afterAll(async () => {
    await mongoHelper.clearDatabase();
    await mongoHelper.closeDatabase();
  });

  it("should create a new product if role is admin and has a valid access_token", async () => {
    const response: Response = await agent
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${access_token}`)
      .field("name", "product2")
      .field("price", "10")
      .field("description", "Haha")
      .field("category", newCategory._id.toString())
      .field("variants[0][color]", "Blue")
      .field("variants[0][size]", "M")
      .field("variants[0][stock]", "20")
      .attach("images", filePath);

    expect(response.status).toBe(201);
  });

  it("should get all products", async () => {
    const query = {
      page: 1,
      limit: 8,
      sort: "Latest added",
      priceOption: "",
      lowestPrice: 1,
      highestPrice: 1000,
      size: "",
      color: "",
      search: "",
    };

    const response = await agent.get("/api/v1/products").query(query);

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should get a single product", async () => {
    const productResponse: Response = await agent
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${access_token}`)
      .field("name", "product2")
      .field("price", "10")
      .field("description", "Haha")
      .field("category", newCategory._id.toString())
      .field("variants[0][color]", "Blue")
      .field("variants[0][size]", "M")
      .field("variants[0][stock]", "20")
      .attach("images", filePath);

    // Call the createCategory endpoint
    const response = await agent.get(
      `/api/v1/products/${productResponse.body.newProduct._id}`
    );

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should update a product if role is admin and has valid access_token", async () => {
    const productResponse: Response = await agent
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${access_token}`)
      .field("name", "product2")
      .field("price", "10")
      .field("description", "Haha")
      .field("category", newCategory._id.toString())
      .field("variants[0][color]", "Blue")
      .field("variants[0][size]", "M")
      .field("variants[0][stock]", "20")
      .attach("images", filePath);

    const response = await request(app)
      .put(`/api/v1/products/${productResponse.body.newProduct._id}`)
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "changed product" });

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should delete a product if role is admin and has valid access_token", async () => {
    const productResponse: Response = await agent
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${access_token}`)
      .field("name", "product2")
      .field("price", "10")
      .field("description", "Haha")
      .field("category", newCategory._id.toString())
      .field("variants[0][color]", "Blue")
      .field("variants[0][size]", "M")
      .field("variants[0][stock]", "20")
      .attach("images", filePath);

    // Call the createCategory endpoint
    const response = await request(app)
      .delete(`/api/v1/products/${productResponse.body.newProduct._id}`)
      .set("Authorization", "Bearer " + access_token);

    // Assertions
    expect(response.status).toBe(200);
  });
});
