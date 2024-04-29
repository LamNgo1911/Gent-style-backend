import request, { Response, SuperTest, Test } from "supertest";
import path from "path";

import app from "../../src/app";
import connect, { MongoHelper } from "../db-helper";
import { createCategory, createUser, getAccess_token } from "../commonUse";

export const filePath = path.resolve(__dirname, "sample-asset", "image.png");

describe("Category controller test", () => {
  let mongoHelper: MongoHelper;
  let agent: request.SuperTest<request.Test>;
  let access_token: string;
  let res: Response;
  const requestBody = {
    name: "Test Category",
  };

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

    res = await createCategory(requestBody.name, filePath, access_token);
  });

  afterAll(async () => {
    await mongoHelper.clearDatabase();
    await mongoHelper.closeDatabase();
  });

  it("should create a new category if role is admin and has valid access_token", async () => {
    // Call the createCategory endpoint
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", "Bearer " + access_token)
      .field("name", requestBody.name)
      .attach("image", filePath);

    // Assertions
    expect(response.status).toBe(201);
  });

  it("should get all categories", async () => {
    // Call the createCategory endpoint
    const response = await agent.get("/api/v1/categories");

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should get a single category", async () => {
    // Call the createCategory endpoint
    const response = await agent.get(
      `/api/v1/categories/${res.body.newCategory._id}`
    );

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should update a category if role is admin and has valid access_token", async () => {
    // Call the createCategory endpoint
    const response = await agent
      .put(`/api/v1/categories/${res.body.newCategory._id}`)
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "T-shirts" });

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should delete a category if role is admin and has valid access_token", async () => {
    // Call the createCategory endpoint
    const response = await agent
      .delete(`/api/v1/categories/${res.body.newCategory._id}`)
      .set("Authorization", "Bearer " + access_token);

    // Assertions
    expect(response.status).toBe(200);
  });
});
