import request, { SuperTest, Test } from "supertest";

import app from "../src/app";

export async function createUser(
  email: string,
  password: string,
  role: string,
  username: string
) {
  const data = {
    email: email,
    password: password,
    role: role,
    username: username,
  };
  return await request(app).post("/api/v1/users/register").send(data);
}

export async function getToken(email: string, password: string) {
  return await request(app)
    .post("/api/v1/users/login")
    .send({ email: email, password: password });
}

export async function createCategory(
  name: string,
  filePath: string,
  token: string
) {
  return await request(app)
    .post("/api/v1/categories")
    .set("Authorization", "Bearer " + token)
    .field("name", name)
    .attach("image", filePath);
}
