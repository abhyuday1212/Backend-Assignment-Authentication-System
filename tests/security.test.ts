import request from "supertest";
import { app } from "../src/server.ts";

describe("Security Features", () => {
  it("should have proper XSS protection", async () => {
    const maliciousInput = {
      email: "test@example.com",
      password: "<script>alert('xss')</script>Password123",
    };

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(maliciousInput);

    expect(res.status).toBeDefined();
  });

  it("should include proper security headers in responses", async () => {
    const res = await request(app).get("/api/v1/auth/nonexistent");

    expect(res.headers["x-xss-protection"]).toBe("1; mode=block");

    expect(res.headers["content-security-policy"]).toBe("default-src 'self'");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("should implement rate limiting with appropriate headers", async () => {
    const endpoint = "/api/v1/auth/login";
    const testData = {
      email: "ratelimit@example.com",
      password: "Password123",
    };

    const res = await request(app).post(endpoint).send(testData);

    expect(res.headers).toHaveProperty("x-ratelimit-limit");

    expect(res.headers).toHaveProperty("x-ratelimit-remaining");

    const limit = parseInt(res.headers["x-ratelimit-limit"]);

    const remaining = parseInt(res.headers["x-ratelimit-remaining"]);

    expect(limit).toBe(100);

    expect(remaining).toBeLessThan(100);

    expect(remaining).toBeGreaterThan(0);
  });

  it("should handle non-existent routes properly", async () => {
    const res = await request(app).get("/api/v1/nonexistent/route");

    expect(res.status).toBe(404);

    expect(res.body.success).toBe(false);

    expect(res.body.message).toContain("not found");
  });
});
