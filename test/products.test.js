const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server"); 
const User = require("../models/usermodel"); 
const Product = require("../models/productmodel"); 

const expect = chai.expect;
chai.use(chaiHttp);

describe("Product Management", () => {
  // Clear user and product collections before each test (if applicable)
  beforeEach(async () => {
    await User.deleteMany({}); // Assuming user model is used for authorization
    await Product.deleteMany({});
  });

  // Login and get a valid token (if authorization is needed)
  let token;
  beforeEach(async () => {
    // Create a user (replace with actual registration logic)
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    await user.save();

    // Login and get the token (replace with actual login logic)
    const loginResponse = await chai
      .request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com", password: "password123" });
    token = loginResponse.body.token;
  });

  // Get All Products (Success)
  it("should get all products successfully", (done) => {
    chai
      .request(app)
      .get("/api/products")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  // Create Product (Success - Authorized)
  it("should create a new product successfully (authorized)", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`) // Include token for authorized requests
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: 19.99,
        category: "Electronics",
        stock: 10,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201); // Created status code
        expect(res.body).to.have.property("name", "Test Product");
        done();
      });
  });

  // Create Product (Failure - Unauthorized)
  it("should fail to create a product without authorization", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .send({
        name: "Test Product",
        description: "This is a test product",
        price: 19.99,
        category: "Electronics",
        stock: 10,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401); // Unauthorized status code
        done();
      });
  });
});
