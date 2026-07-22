import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("GET /api/v1/vehicles", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let userToken: string;
  let testUserId: string;

  beforeAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: "getvehicleuser@test.com" },
    });

    const user = await prisma.user.create({
      data: {
        name: "Get Vehicle User",
        email: "getvehicleuser@test.com",
        passwordHash: "hashedpassword",
        role: "USER",
      },
    });
    testUserId = user.id;
    userToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret
    );
  });

  beforeEach(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
  });

  afterAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
    await prisma.$disconnect();
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app).get("/api/v1/vehicles");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return empty list when no vehicles exist", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(0);
  });

  it("should return a list of all available vehicles for authenticated user", async () => {
    await prisma.vehicle.createMany({
      data: [
        {
          make: "Honda",
          model: "Civic",
          categoryId: "sedan",
          price: 22000,
          quantity: 4,
          description: "Compact sedan",
        },
        {
          make: "Ford",
          model: "Mustang",
          categoryId: "sports",
          price: 45000,
          quantity: 2,
          description: "Sports car",
        },
      ],
    });

    const res = await request(app)
      .get("/api/v1/vehicles")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0]).toHaveProperty("make");
    expect(res.body.data[0]).toHaveProperty("model");
  });
});
