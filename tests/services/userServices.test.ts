import connect, { MongoHelper } from "../db-helper";
import userService from "../../src/services/users";
import User, { UserDocument } from "../../src/models/User";

// Todo: Create a new user
async function createUser(role: string): Promise<UserDocument> {
  const user: UserDocument = new User({
    username: "user1",
    email: "lamngo1@gmail.com",
    password: "lam123",
    role,
  });
  return await userService.createUser(user);
}

//tear down
describe("User controller test", () => {
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
  // Todo: Create user
  it("should create a user", async () => {
    const newUser = await createUser("USER");
    expect(newUser).toHaveProperty("_id");
  });

  // Todo: Get a user by email
  it("should get a user by email", async () => {
    // create new user
    const newUser = await createUser("USER");

    // check user list
    const user = await userService.getUserByEmail(newUser.email);
    expect(user).toHaveProperty("_id");
  });

  // TTodo: Update password
  it("should update a new password", async () => {
    // create new user
    const newUser: UserDocument = await createUser("USER");

    // check user list
    const user = await userService.updatePassword(newUser, "hahaha");
    expect(user).toHaveProperty("_id");
  });

  // Todo: Get all users
  //   it("should return list of users", async () => {
  //     // create new user
  //     await createUser("ADMIN");

  //     // check user list
  //     const userList = await userService.getAllUsers({}, "-createdAt", 0, 8);
  //     expect(userList.length).toEqual(1);
  //   });

  // Todo: Get a single user
  it("should get a user", async () => {
    // create new user
    const newUser = await createUser("ADMIN");

    // check user list
    const user = await userService.getSingleUser(newUser.id);
    expect(user).toHaveProperty("_id");
  });

  // Todo: Update a user
  it("should update a user", async () => {
    // create new user
    const newUser = await createUser("ADMIN");

    // check user list
    const user = await userService.updateUser(newUser.id, {
      username: "hahaha",
    });

    expect(user.username).toBe("hahaha");
  });

  // Todo: Delete a user
  it("should delete a user", async () => {
    // create new user
    const newUser = await createUser("ADMIN");

    // check user list
    const user = await userService.deleteUser(newUser.id);
    expect(user).toHaveProperty("_id");
  });

  // Todo: Ban or unban a user by admin
  it("should ban or unban a user", async () => {
    // create new user
    const newUser = await createUser("ADMIN");

    // check user list
    const user = await userService.updateUserStatus(newUser.id, "DISABLED");
    expect(user).toHaveProperty("_id");
  });

  // Todo: Find or create user
  it("should ban or unban a user", async () => {
    // create new user
    const newUser = await createUser("ADMIN");

    // check user list
    const user = await userService.findOrCreate({
      email: newUser.email,
      password: newUser.password,
    });
    expect(user).toHaveProperty("_id");
  });
});
