import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("GET /api/v1/vehicles/stats", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let adminToken: string;
  let userToken: string;
  let adminUserId: string;
  let regularUserId: string;

  beforeAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { in: ["statsadmin@test.com", "statsuser@test.com"] } },
    });

    const admin = await prisma.user.create({
      data: {
        name: "Stats Admin User",
        email: "statsadmin@test.com",
        passwordHash: "hashedpassword",
        role: "ADMIN",
      },
    });
    adminUserId = admin.id;
    adminToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      secret
    );

    const regularUser = await prisma.user.create({
      data: {
        name: "Stats Regular User",
        email: "statsuser@test.com",
        passwordHash: "hashedpassword",
        role: "USER",
      },
    });
    regularUserId = regularUser.id;
    userToken = jwt.sign(
      { id: regularUser.id, email: regularUser.email, role: regularUser.role },
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
      where: { id: { in: [adminUserId, regularUserId] } },
    });
    await prisma.$disconnect();
  });

  it("should reject unauthenticated request with 401", async () => {
    const res = await request(app).get("/api/v1/vehicles/stats");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject non-admin request with 403", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/stats")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/forbidden|admin/i);
  });

  it("should return zero metrics for admin when inventory is empty", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      totalVehicles: 0,
      totalUnits: 0,
      totalInventoryValue: 0,
      outOfStockCount: 0,
      totalPurchases: 0,
      totalRevenue: 0,
    });
  });

  it("should return accurate dashboard stats for admin user", async () => {
    const v1 = await prisma.vehicle.create({
      data: {
        make: "Toyota",
        model: "Camry",
        categoryId: "Sedan",
        price: 25000,
        quantity: 5,
        createdById: adminUserId,
      },
    });

    const v2 = await prisma.vehicle.create({
      data: {
        make: "Tesla",
        model: "Model 3",
        categoryId: "Electric",
        price: 40000,
        quantity: 0, // Out of stock
        createdById: adminUserId,
      },
    });

    // Create a purchase record
    await prisma.purchase.create({
      data: {
        userId: regularUserId,
        vehicleId: v1.id,
        quantity: 2,
        totalPrice: 50000,
      },
    });

    const res = await request(app)
      .get("/api/v1/vehicles/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      totalVehicles: 2, // 2 distinct models (Toyota Camry, Tesla Model 3)
      totalUnits: 5, // 5 + 0
      totalInventoryValue: 125000, // (25000 * 5) + (40000 * 0)
      outOfStockCount: 1, // Tesla Model 3
      totalPurchases: 1,
      totalRevenue: 50000,
    });
  });
});
