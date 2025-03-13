import request from "supertest";
import { app } from "../src/server.js";
import { User } from "../src/schema/user.schema.js";
import { resetTokens } from "../src/cache/user.cache.js";

const testUser = {
  email: "testauth@example.com",
  password: "Password123",
};

let userToken = "";
let userId = "";
let resetToken = "";

beforeAll(async () => {
  try {
    await User.deleteMany({
      email: testUser.email,
    });
  } catch (error) {
    console.log("Error cleaning up test data:", error);
  }
});

afterAll(async () => {
  try {
    await User.deleteMany({
      email: testUser.email,
    });
  } catch (error) {
    console.log("Error cleaning up test data:", error);
  }
});

describe("Auth Controller Tests", () => {
  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.status).toBe(201);

      expect(res.body.success).toBe(true);

      expect(res.body.data.email).toBe(testUser.email);

      userId = res.body.data._id;
    });

    it("should not register user with existing email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.status).toBe(400);

      expect(res.body.success).toBe(false);

      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("User Login", () => {
    it("should login successfully with valid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.data.user.email).toBe(testUser.email);

      const cookies = Array.isArray(res.headers["set-cookie"])
        ? res.headers["set-cookie"]
        : [res.headers["set-cookie"]];

      expect(cookies.some((cookie) => cookie.includes("accessToken"))).toBe(
        true
      );

      expect(cookies.some((cookie) => cookie.includes("refreshToken"))).toBe(
        true
      );
    });

    it("should reject login with wrong password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: testUser.email,
        password: "WrongPassword123",
      });

      expect(res.status).toBe(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe("Password Reset Flow", () => {
    it("should initiate password reset process", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forget")
        .send({ email: testUser.email });

      expect(res.status).toBe(200);

      expect(res.body.success).toBe(true);

      const storedData = resetTokens.get(testUser.email);

      expect(storedData).toBeTruthy();
      expect(storedData?.token).toBeTruthy();

      resetToken = storedData?.token!; 

      expect(resetToken).toBeTruthy();
    });

    it("should reject password reset for non-existent email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forget")
        .send({ email: "nonexistent@example.com" });

      expect(res.status).toBe(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe("Token Refresh", () => {
    it("should return error when refresh token is missing", async () => {
      const res = await request(app).post("/api/v1/auth/refresh");

      expect(res.status).toBe(401);

      expect(res.body.success).toBe(false);
    }, 10000);
  });
});
