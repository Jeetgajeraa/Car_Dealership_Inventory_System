import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("DELETE /api/v1/vehicles/:id", () => {
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
        email: { in: ["deleteadmin@test.com", "deleteuser@test.com"] },
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        name: "Delete Admin",
        email: "deleteadmin@test.com",
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
        name: "Delete User",
        email: "deleteuser@test.com",
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
        make: "Nissan",
        model: "Altima",
        categoryId: "sedan",
        price: 19000,
        quantity: 3,
        description: "To be deleted",
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
    const res = await request(app).delete(
      `/api/v1/vehicles/${testVehicleId}`
    );

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject deletion by non-admin user", async () => {
    const res = await request(app)
      .delete(`/api/v1/vehicles/${testVehicleId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 when deleting non-existent vehicle", async () => {
    const res = await request(app)
      .delete("/api/v1/vehicles/non-existent-id")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should delete vehicle successfully (Admin)", async () => {
    const res = await request(app)
      .delete(`/api/v1/vehicles/${testVehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Vehicle deleted successfully");

    // Verify database record is deleted
    const deleted = await prisma.vehicle.findUnique({
      where: { id: testVehicleId },
    });
    expect(deleted).toBeNull();
  });
});
