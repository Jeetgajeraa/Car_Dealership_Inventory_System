import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("Inventory Endpoints (Purchase & Restock)", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let adminToken: string;
  let userToken: string;
  let adminUserId: string;
  let regularUserId: string;
  let testVehicleId: string;

  beforeAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: { in: ["invadmin@test.com", "invuser@test.com"] },
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        name: "Inv Admin",
        email: "invadmin@test.com",
        passwordHash: "hashedpassword",
        role: "ADMIN",
      },
    });
    adminUserId = adminUser.id;
    adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      secret
    );

    const regularUser = await prisma.user.create({
      data: {
        name: "Inv User",
        email: "invuser@test.com",
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

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Toyota",
        model: "RAV4",
        categoryId: "suv",
        price: 30000,
        quantity: 2,
        description: "Stock test vehicle",
      },
    });
    testVehicleId = vehicle.id;
  });

  afterAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { id: { in: [adminUserId, regularUserId] } },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/v1/vehicles/:id/purchase", () => {
    it("should reject unauthenticated purchase request", async () => {
      const res = await request(app)
        .post(`/api/v1/vehicles/${testVehicleId}/purchase`)
        .send({ quantity: 1 });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 when purchasing non-existent vehicle", async () => {
      const res = await request(app)
        .post("/api/v1/vehicles/non-existent-id/purchase")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should reject purchase when stock is insufficient", async () => {
      const res = await request(app)
        .post(`/api/v1/vehicles/${testVehicleId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 5 }); // Stock is only 2

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should successfully purchase vehicle, decrement stock, and record purchase", async () => {
      const res = await request(app)
        .post(`/api/v1/vehicles/${testVehicleId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.vehicle.quantity).toBe(1);

      // Check DB purchase record created
      const purchases = await prisma.purchase.findMany({
        where: { vehicleId: testVehicleId, userId: regularUserId },
      });
      expect(purchases.length).toBe(1);
    });
  });

  describe("POST /api/v1/vehicles/:id/restock", () => {
    it("should reject restock by non-admin user", async () => {
      const res = await request(app)
        .post(`/api/v1/vehicles/${testVehicleId}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should reject restock with non-positive quantity", async () => {
      const res = await request(app)
        .post(`/api/v1/vehicles/${testVehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 0 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should successfully restock vehicle and increment stock (Admin)", async () => {
      const res = await request(app)
        .post(`/api/v1/vehicles/${testVehicleId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(7); // Initial 2 + 5 restocked = 7
    });
  });
});
