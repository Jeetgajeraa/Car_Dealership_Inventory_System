import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("GET /api/v1/purchases", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let user1Token: string;
  let user2Token: string;
  let user1Id: string;
  let user2Id: string;
  let vehicleId: string;

  beforeAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: { in: ["purchaser1@test.com", "purchaser2@test.com"] },
      },
    });

    const user1 = await prisma.user.create({
      data: {
        name: "Purchaser One",
        email: "purchaser1@test.com",
        passwordHash: "hashedpassword",
        role: "USER",
      },
    });
    user1Id = user1.id;
    user1Token = jwt.sign(
      { id: user1.id, email: user1.email, role: user1.role },
      secret
    );

    const user2 = await prisma.user.create({
      data: {
        name: "Purchaser Two",
        email: "purchaser2@test.com",
        passwordHash: "hashedpassword",
        role: "USER",
      },
    });
    user2Id = user2.id;
    user2Token = jwt.sign(
      { id: user2.id, email: user2.email, role: user2.role },
      secret
    );
  });

  beforeEach(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Honda",
        model: "Accord",
        categoryId: "sedan",
        price: 28000,
        quantity: 5,
        description: "Purchase history test vehicle",
      },
    });
    vehicleId = vehicle.id;

    // Create a purchase for user1
    await prisma.purchase.create({
      data: {
        userId: user1Id,
        vehicleId: vehicleId,
        quantity: 2,
        totalPrice: 56000,
      },
    });
  });

  afterAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { id: { in: [user1Id, user2Id] } },
    });
    await prisma.$disconnect();
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app).get("/api/v1/purchases");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return empty list if user has no purchases", async () => {
    const res = await request(app)
      .get("/api/v1/purchases")
      .set("Authorization", `Bearer ${user2Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("should return purchase history for authenticated user with vehicle details", async () => {
    const res = await request(app)
      .get("/api/v1/purchases")
      .set("Authorization", `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].userId).toBe(user1Id);
    expect(res.body.data[0].vehicleId).toBe(vehicleId);
    expect(res.body.data[0].vehicle.make).toBe("Honda");
    expect(res.body.data[0].vehicle.model).toBe("Accord");
  });
});
