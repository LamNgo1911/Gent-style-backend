import connect, { MongoHelper } from "../db-helper";
import Product, { ProductDocument } from "../../src/models/Product";
import productService from "../../src/services/products";
import categoryService from "../../src/services/categories";
import userService from "../../src/services/users";
import orderService from "../../src/services/orders";
import Category from "../../src/models/Category";
import Order, { OrderDocument } from "../../src/models/Order";
import User, { UserDocument } from "../../src/models/User";
import CartItem from "../../src/models/CartItem";

//tear down
describe("Order controller test", () => {
  // connect database
  let mongoHelper: MongoHelper;
  let newProduct: ProductDocument;
  let newOrder: OrderDocument;
  let newUser: UserDocument;

  beforeAll(async () => {
    mongoHelper = await connect();

    const userData = new User({
      username: "user1",
      email: "lamngo1@gmail.com",
      password: "lam123",
      role: "ADMIN",
    });

    newUser = await userService.createUser(userData);

    const categoryData = new Category({ name: "category1", image: "###" });
    const newCategory = await categoryService.createCategory(categoryData);

    const product = new Product({
      name: "product1",
      image: "###",
      price: 10,
      description: "haha",
      category: newCategory._id,
      variants: [
        {
          color: "Black",
          size: "M",
          stock: 100,
        },
      ],
      images: ["####", "$$$$"],
    });

    newProduct = await productService.createProduct(product);

    const cartItemData = {
      userId: newUser._id,
      product: newProduct._id,
      color: "NONE",
      size: "S",
      image:
        "https://res.cloudinary.com/do4deaika/image/upload/v1713781170/qgwex0gd8p8purwltx3r.jpg",
      quantity: 2,
      imageAnalysis:
        "The image appears to be a white jacket with a floral pattern, possibly a dress or a coat. The jacket is hanging on a wooden hanger, and there is a bird perched on the hanger. The bird is likely a symbol of freedom or a representation of the jacket's design. The image is likely a fashion or lifestyle photo, and the bird adds a touch of whimsy to the scene.",
    };

    const newCartItem = new CartItem(cartItemData);

    const orderData = {
      userId: newUser._id,
      shipment: {
        method: "express",
        trackingNumber: "XYZ123456",
        address: {
          street: "123 Main St",
          city: "Cityville",
          state: "Stateville",
          postalCode: "12345",
          country: "Countryland",
        },
      },
      priceSum: 100.0,
      orderItems: [newCartItem],
      status: "PAID",
    };

    const order = new Order(orderData);

    newOrder = await orderService.createOrder(order);
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
    await mongoHelper.clearDatabase();
  });

  // test suit
  // Todo: Create a new order
  it("should create a new order", async () => {
    expect(newOrder).toHaveProperty("_id");
  });

  // Todo: Get an order by id
  it("should get an order by id", async () => {
    const order = await orderService.getOrderById(newOrder._id, newUser._id);

    expect(order).toHaveProperty("_id");
  });

  // Todo: Get all orders of an user
  it("should return all orders of an user", async () => {
    const orders = await orderService.getAllOrdersByUserId(newUser._id, 3, 10);

    expect(orders.length).toEqual(1);
  });

  // Todo: Get all orders by admin
  it("should get all orders by admin", async () => {
    const orders = await orderService.getAllOrders();

    expect(orders.length).toEqual(1);
  });

  // Todo: Update a new order
  it("should update a order", async () => {
    const order = await orderService.updateOrder(newOrder._id, {
      priceSum: 19,
    });
    expect(order).toHaveProperty("_id");
  });

  // Todo: Delete a order
  it("should delete a order", async () => {
    const order = await orderService.deleteOrderById(newOrder._id);
    expect(order).toHaveProperty("_id");
  });
});
