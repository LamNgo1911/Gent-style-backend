import connect, { MongoHelper } from "../db-helper";
import Product, { ProductDocument } from "../../src/models/Product";
import productService from "../../src/services/products";
import categoryService from "../../src/services/categories";
import Category from "../../src/models/Category";

//tear down
describe("Product controller test", () => {
  // connect database
  let mongoHelper: MongoHelper;
  let newProduct: ProductDocument;

  beforeAll(async () => {
    mongoHelper = await connect();

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
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
    await mongoHelper.clearDatabase();
  });

  // test suit
  // Todo: Get all products
  it("should return list of products", async () => {
    const [products, count] = await productService.getAllProducts({}, 0, 10);

    expect(products.length).toEqual(1);
    expect(products[0]).toHaveProperty("name");
  });

  // Todo: Get a single product
  it("should get single a product", async () => {
    const product = await productService.getSingleProduct(newProduct._id);

    expect(product).toHaveProperty("name");
  });

  // Todo: Create product
  it("should create a product", async () => {
    expect(newProduct).toHaveProperty("_id");
    expect(newProduct).toHaveProperty("name");
  });

  // Todo: Update a product
  it("should update a product", async () => {
    const product = await productService.updateProduct(newProduct._id, {
      name: "Haha",
    });
    expect(product.name).toBe("Haha");
  });

  // Todo: Delete a product
  it("should delete a product", async () => {
    const product = await productService.deleteProduct(newProduct._id);
    expect(product).toHaveProperty("name");
  });
});
