import request from "supertest";
import app from "../../app";
import prisma from "../../prisma";

describe("POST /api/v1/auth/login", () => {
  const testEmail = "loginuser@test.com";

  const cleanDatabase = async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });
  };

  beforeEach(async () => {
    await cleanDatabase();

    // Create a registered user for login tests
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Login User",
        email: testEmail,
        password: "Password123",
      });
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  it("should log in successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: "Password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User logged in successfully");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toEqual({
      id: expect.any(String),
      name: "Login User",
      email: testEmail,
      role: "USER",
    });
  });

  it("should reject login with incorrect password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testEmail,
        password: "WrongPassword123",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should reject login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "nonexistent@test.com",
        password: "Password123",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should reject login with invalid email format", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "not-an-email",
        password: "Password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
