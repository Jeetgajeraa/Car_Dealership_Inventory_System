import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("PUT /api/v1/vehicles/:id", () => {
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
        email: { in: ["updateadmin@test.com", "updateuser@test.com"] },
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        name: "Update Admin",
        email: "updateadmin@test.com",
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
        name: "Update User",
        email: "updateuser@test.com",
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
        make: "Hyundai",
        model: "Elantra",
        categoryId: "sedan",
        price: 20000,
        quantity: 10,
        description: "Initial description",
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

  it("should reject unauthenticated request", async () => {
    const res = await request(app)
      .put(`/api/v1/vehicles/${testVehicleId}`)
      .send({ price: 21000 });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject update by non-admin user", async () => {
    const res = await request(app)
      .put(`/api/v1/vehicles/${testVehicleId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 21000 });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 when updating non-existent vehicle", async () => {
    const res = await request(app)
      .put("/api/v1/vehicles/non-existent-id")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 21000 });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should update vehicle details successfully with valid payload (Admin)", async () => {
    const res = await request(app)
      .put(`/api/v1/vehicles/${testVehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: 21500,
        quantity: 8,
        description: "Updated description",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.price).toBe(21500);
    expect(res.body.data.quantity).toBe(8);
    expect(res.body.data.description).toBe("Updated description");
  });

  it("should reject update with invalid payload (negative price)", async () => {
    const res = await request(app)
      .put(`/api/v1/vehicles/${testVehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: -500,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
