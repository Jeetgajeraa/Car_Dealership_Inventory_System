import request from "supertest";
import app from "../../app";
import prisma from "../../prisma";

describe("POST /api/v1/auth/register", () => {
  const testEmails = ["jeet@test.com", "duplicate@test.com"];

  const cleanDatabase = async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: testEmails,
        },
      },
    });
  };

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Jeet",
        email: "jeet@test.com",
        password: "Password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should reject duplicate email", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Jeet",
        email: "duplicate@test.com",
        password: "Password123",
      });

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Jeet",
        email: "duplicate@test.com",
        password: "Password123",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should reject invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Jeet",
        email: "invalid-email",
        password: "Password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject weak password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Jeet",
        email: "jeet@test.com",
        password: "123",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject missing name", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "jeet@test.com",
        password: "Password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});