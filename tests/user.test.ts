import request from "supertest";
import { app } from "../src/server.ts";
import { User } from "../src/schema/user.schema.ts";

const testUser = {
  email: "testuser@example.com",
  password: "Password123",
};

let userToken = "";
let userId = "";

beforeAll(async () => {
  await User.deleteMany({ email: testUser.email });

  const registerRes = await request(app)
    .post("/api/v1/auth/register")
    .send(testUser);

  userId = registerRes.body.data._id;

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });

  const cookies = Array.isArray(loginRes.headers["set-cookie"])
    ? loginRes.headers["set-cookie"]
    : [loginRes.headers["set-cookie"]];
  const accessCookie = cookies.find((cookie) => cookie.includes("accessToken"));
  userToken = accessCookie.split(";")[0].split("=")[1];
});

afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
});

describe("User Controller Tests", () => {
  describe("User Profile", () => {
    it("should get user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/v1/user/profile")
        .set("Cookie", [`accessToken=${userToken}`]);

      expect(res.status).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.data.email).toBe(testUser.email);
    });

    it("should reject profile access without token", async () => {
      const res = await request(app).get("/api/v1/user/profile");

      expect(res.status).toBe(401);

      expect(res.body.success).toBe(false);
    });

    it("should update user email with valid token", async () => {
      const updatedEmail = "updated@example.com";

      const res = await request(app)
        .put("/api/v1/user/profile")
        .set("Cookie", [`accessToken=${userToken}`])
        .send({ email: updatedEmail });

      expect(res.status).toBe(200);

      expect(res.body.success).toBe(true);

      expect(res.body.data.email).toBe(updatedEmail);

      await request(app)
        .put("/api/v1/user/profile")
        .set("Cookie", [`accessToken=${userToken}`])
        .send({ email: testUser.email });
    });
  });

  describe("User Logout", () => {
    it("should logout user and clear cookies", async () => {
      const res = await request(app)
        .post("/api/v1/user/logout")
        .set("Cookie", [`accessToken=${userToken}`]);

      expect(res.status).toBe(200);

      expect(res.body.success).toBe(true);

      const cookies = Array.isArray(res.headers["set-cookie"])
        ? res.headers["set-cookie"]
        : [res.headers["set-cookie"]];

      expect(
        cookies.some(
          (cookie) =>
            cookie.includes("accessToken") &&
            (cookie.includes("Max-Age=0") || cookie.includes("Expires="))
        )
      ).toBe(true);

      expect(
        cookies.some(
          (cookie) =>
            cookie.includes("refreshToken") &&
            (cookie.includes("Max-Age=0") || cookie.includes("Expires="))
        )
      ).toBe(true);
    });
  });
});
