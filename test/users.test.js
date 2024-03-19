const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const User = require("../models/usermodel");

const expect = chai.expect;
chai.use(chaiHttp);

describe("User Authentication", () => {
  // Clear user collection before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Register Success
  it("should register a new user successfully", (done) => {
    chai
      .request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  // Register Failure (Existing User)
  it("should fail to register with an existing email", (done) => {
    // Create a user first
    const existingUser = new User({
      name: "Existing User",
      email: "existing@example.com",
      password: "existingpassword",
    });
    existingUser.save().then(() => {
      chai
        .request(app)
        .post("/api/users/register")
        .send({
          name: "Another User",
          email: "existing@example.com",
          password: "anotherpassword",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.text).to.contain("Email already exists");
          done();
        });
    });
  });

  // Login Success
  it("should login a user with valid credentials", (done) => {
    // Create a user first
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    user.save().then(() => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "password123" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("token");
          done();
        });
    });
  });

  // Login Failure (Invalid Email)
  it("should fail to login with an invalid email", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({ email: "invalid@example.com", password: "password123" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.text).to.contain("Invalid email or password");
        done();
      });
  });

  // Login Failure (Invalid Password)
  it("should fail to login with an invalid password", (done) => {
    // Create a user first
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    user.save().then(() => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "wrongpassword" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.text).to.contain("Invalid email or password");
          done();
        });
    });
  });
});
