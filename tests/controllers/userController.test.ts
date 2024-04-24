import request from "supertest";

import app from "../../src/app";
import connect, { MongoHelper } from "../db-helper";
import { createUser, getAccess_token } from "../commonUse";

describe("User controller test", () => {
  let mongoHelper: MongoHelper;
  let access_token: string;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  it("should create a new user", async () => {
    const data = {
      email: "user1@gmail.com",
      password: "123lam",
      role: "ADMIN",
      username: "Lam",
    };

    const response = await request(app)
      .post("/api/v1/users/register")
      .send(data);
    // Assertions
    expect(response.status).toBe(201);
  });

  it("should login and return a access_token", async () => {
    const userinfo = await createUser(
      "user1@gmail.com",
      "123lam",
      "ADMIN",
      "Lam"
    );

    const response = await request(app)
      .post("/api/v1/users/login")
      .send({ email: userinfo.body.newUser.email, password: "123lam" });

    // Assertions
    expect(response.status).toBe(200);
  });

  // it("should return a message successfully", async () => {
  //   const userinfo = await createUser(
  //     "user1@gmail.com",
  //     "123lam",
  //     "ADMIN",
  //     "Lam"
  //   );

  //   const response = await request(app)
  //     .post("/api/v1/users/forgot-password")
  //     .send({ email: userinfo.body.newUser.email });

  //   // Assertions
  //   expect(response.status).toBe(200);
  // });

  // it("should reset a password", async () => {
  //   const userinfo = await createUser(
  //     "user1@gmail.com",
  //     "123lam",
  //     "ADMIN",
  //     "Lam"
  //   );

  //   const res = await sendVerification(userinfo.body.newUser.email);
  //   console.log(res.body.resetAccess_token);
  //   const response = await request(app)
  //     .post(`/api/v1/users/reset-password?resetAccess_token=${res.body.resetAccess_token}`)
  //     .send({ newPassword: "lamngo123" });

  //   // Assertions
  //   expect(response.status).toBe(200);
  // });

  it("should get all user if the role is admin and has valid access_token", async () => {
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

    const response = await request(app)
      .get(`/api/v1/admin/users`)
      .set("Authorization", "Bearer " + access_token);

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should get all user if the role is admin and has valid access_token", async () => {
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

    const response = await request(app)
      .get(`/api/v1/admin/users/${userinfo.body.newUser._id}`)
      .set("Authorization", "Bearer " + access_token);

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should update a user information without password", async () => {
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

    const newUserInfo = {
      username: "lala",
      email: "user1@gmail.com",
    };

    const response = await request(app)
      .put(`/api/v1/admin/users/${userinfo.body.newUser._id}`)
      .set("Authorization", "Bearer " + access_token)
      .send(newUserInfo);

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should ban a user", async () => {
    const userinfoAdmin = await createUser(
      "user1@gmail.com",
      "123lam",
      "ADMIN",
      "Lam"
    );

    const userAdmin = await getAccess_token(
      userinfoAdmin.body.newUser.email,
      "123lam"
    );
    access_token = userAdmin.body.access_token;

    const userinfo1 = await createUser(
      "user2@gmail.com",
      "123lam",
      "USER",
      "Lam"
    );

    const response = await request(app)
      .post(`/api/v1/admin/users/change-status`)
      .set("Authorization", "Bearer " + access_token)
      .send({ userId: userinfo1.body.newUser._id, status: "DISABLED" });

    // Assertions
    expect(response.status).toBe(200);
  });
});

// Todo: Send verification link to user
async function sendVerification(email: string) {
  return await request(app)
    .post("/api/v1/users/forgot-password")
    .send({ email });
}
