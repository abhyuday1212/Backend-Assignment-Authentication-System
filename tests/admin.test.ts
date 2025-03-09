import request from "supertest";
import { app } from "../src/server.ts";
import { User } from "../src/schema/user.schema.ts";

// Test users
const adminUser = {
  email: "admin_test@example.com",
  password: "AdminPass123",
  role: "admin",
};

const regularUser = {
  email: "regular_test@example.com",
  password: "RegularPass123",
};

let adminToken = "";
let regularToken = "";

jest.setTimeout(15000);

beforeAll(async () => {
  await User.deleteMany({
    email: { $in: [adminUser.email, regularUser.email] },
  });

  await request(app).post("/api/v1/auth/register").send(adminUser);

  await request(app).post("/api/v1/auth/register").send(regularUser);

  const adminLoginRes = await request(app).post("/api/v1/auth/login").send({
    email: adminUser.email,
    password: adminUser.password,
  });

  const adminCookies = adminLoginRes.headers["set-cookie"];

  const adminCookiesArray = Array.isArray(adminCookies)
    ? adminCookies
    : [adminCookies];

  const adminAccessCookie = adminCookiesArray.find((cookie) =>
    cookie.includes("accessToken")
  );

  adminToken = adminAccessCookie.split(";")[0].split("=")[1];

  const regularLoginRes = await request(app).post("/api/v1/auth/login").send({
    email: regularUser.email,
    password: regularUser.password,
  });

  const regularCookies = regularLoginRes.headers["set-cookie"];

  const cookiesArray = Array.isArray(regularCookies)
    ? regularCookies
    : [regularCookies];

  const regularAccessCookie = cookiesArray.find((cookie) =>
    cookie.includes("accessToken")
  );

  regularToken = regularAccessCookie.split(";")[0].split("=")[1];
}, 10000);

afterAll(async () => {
  await User.deleteMany({
    email: { $in: [adminUser.email, regularUser.email] },
  });
});

describe("Admin API", () => {
  it("should allow admin to delete a user", async () => {
    const userToDelete = {
      email: "to-be-deleted@example.com",
      password: "DeleteMe123",
    };

    const createRes = await request(app)
      .post("/api/v1/auth/register")
      .send(userToDelete);

    const userId = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/v1/admin/user/${userId}`)
      .set("Cookie", [`accessToken=${adminToken}`]);

    expect(deleteRes.status).toBe(200);
    
    expect(deleteRes.body.success).toBe(true);

    const user = await User.findById(userId);
    expect(user).toBeNull();
  });

  it("should prevent regular user from deleting a user", async () => {
    const anotherUser = {
      email: "another-user@example.com",
      password: "AnotherPass123",
    };

    const createRes = await request(app)
      .post("/api/v1/auth/register")
      .send(anotherUser);

    const userId = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/v1/admin/user/${userId}`)
      .set("Cookie", [`accessToken=${regularToken}`]);

    expect(deleteRes.status).toBe(403);

    expect(deleteRes.body.success).toBe(false);

    expect(deleteRes.body.message).toContain(
      "does not have the required permissions"
    );

    await User.deleteMany({ email: anotherUser.email });
  });

  it("should reject delete request with invalid user ID", async () => {
    const deleteRes = await request(app)
      .delete("/api/v1/admin/user/invaliduserid")
      .set("Cookie", [`accessToken=${adminToken}`]);

    expect(deleteRes.status).toBeGreaterThanOrEqual(400);

    expect(deleteRes.body.success).toBe(false);
  });

  it("should reject delete request without authentication", async () => {
    const deleteRes = await request(app).delete(
      `/api/v1/admin/user/someUserId`
    );

    expect(deleteRes.status).toBe(401);

    expect(deleteRes.body.success).toBe(false);
  });
});
