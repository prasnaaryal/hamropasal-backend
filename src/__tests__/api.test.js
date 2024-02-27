import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import app from "./../app.mjs";
import connectDb from "./../database/connection.js";
import dotenv from "dotenv";

dotenv.config();

let server;
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

describe("API Integration Tests", () => {
    describe("POST /api/auth/login", () => {
      it("should authenticate user with valid credentials", async () => {
        const res = await request(server).post("/api/auth/login").send({
          email: "sussygheu1@gmail.com",
          password: "password",
        });

        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
      }, 40000);

      it("should not authenticate user with invalid credentials", async () => {
        const res = await request(server).post("/api/auth/login").send({
          email: "prasnaworks@gmail.com",
          password: "WrongPassword!",
        });

        console.log(res.body);

        expect(res.statusCode).toBe(400);
      }, 40000);
    });
});
