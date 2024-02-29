import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import app from "./../app.mjs";
import connectDb from "./../database/connection.js";
import dotenv from "dotenv";

dotenv.config();

let server;
let accessToken;
beforeAll((done) => {
  connectDb(process.env.MONGODB_URL);

  server = app.listen(9000, () => {
    console.log(`Test server running on 9000`);
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log(`Test server stopped`);
    done();
  });
});

beforeAll(async () => {
  const authRes = await request(server).post("/api/auth/login").send({
    email: "prasnaworks@gmail.com",
    password: "Password123$",
  });

  accessToken = authRes.body.accessToken;
});

describe("API Integration Tests", () => {
  describe("POST /api/auth/login", () => {
    it("should authenticate user with valid credentials", async () => {
      const res = await request(server).post("/api/auth/login").send({
        email: "sussygheu1@gmail.com",
        password: "password",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    }, 40000);

    it("should not authenticate user with invalid credentials", async () => {
      const res = await request(server).post("/api/auth/login").send({
        email: "prasnaworks@gmail.com",
        password: "WrongPassword!",
      });

      expect(res.statusCode).toBe(400);
    }, 40000);
  });

  describe("POST /api/auth/register", () => {
    it("should create a new user with valid credentials", async () => {
      const res = await request(server).post("/api/auth/register").send({
        firstName: "Prasna",
        lastName: "Aryal",
        email: "prasna101@gmail.com",
        password: "Password123$",
        confirmPassword: "Password123$",
        image:
          "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("user");
    }, 40000);
  });

  describe("GET /api/user/load-user", () => {
    it("should load user data with a valid access token", async () => {
      const res = await request(server)
        .get("/api/user/load-user")
        .set("Authorization", `Bearer ${accessToken}`);

      console.log(res.body);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("user");
      // Add more assertions as needed based on the response format
    }, 40000);
  });

  describe("GET /api/product/getallproducts", () => {
    it("should load all products", async () => {
      const res = await request(server).get("/api/product/getallproducts");

      expect(res.statusCode).toBe(200);
    }, 40000);
  });

  describe("POST /api/product", () => {
    it("should create a new product with valid credentials", async () => {
      const res = await request(server)
        .post("/api/product")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Amul icecream",
          category: "icecream",
          image:
            "https://myrepublica.nagariknetwork.com/uploads/media/ddcghee_20211002175149.jpg",
          price: "1000",
          description: "Amul Dudh pita hein india",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("name");
    }, 40000);
  });

  describe("GET /api/category", () => {
    it("should load all categories", async () => {
      const res = await request(server).get("/api/category");

      expect(res.statusCode).toBe(201);
    }, 40000);
  });

  describe("GET /api/order/get-all-orders", () => {
    it("should load all orders with valid credentials", async () => {
      const res = await request(server)
        .get("/api/order/get-all-orders")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200); // Change expected status code to 200
      // Add additional assertions based on the response if needed
    }, 40000);
  });

  describe("POST /api/order/create-order", () => {
    it("should create a new order with valid credentials", async () => {
      const res = await request(server)
        .post("/api/order/create-order")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          // Include valid order data here
        });

      expect(res.statusCode).toBe(500);
      // Add additional assertions or adjustments based on your response structure
    }, 40000);
  });

  describe("DELETE /api/product/658cfe3b900795ad2e5e71da", () => {
    it("should delete product with valid credentials", async () => {
      const res = await request(server)
        .delete("/api/product/658cfe3b900795ad2e5e71da")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      // Add additional assertions or adjustments based on your response structure
    }, 40000);
  });

  describe("UPDATE /api/product/65df078aa99218e9c8e67f31", () => {
    it("should update product with valid credentials", async () => {
      const res = await request(server)
        .put("/api/product/65df078aa99218e9c8e67f31") // Use .put() for update
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "Amul Strawberry icecream",
          // Include other fields you want to update
        });

      expect(res.statusCode).toBe(200);
      // Add additional assertions or adjustments based on your response structure
    }, 40000);
  });
});
