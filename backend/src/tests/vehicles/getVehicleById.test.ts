import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("GET /api/v1/vehicles/:id", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let userToken: string;
  let regularUserId: string;
  let testVehicleId: string;

  beforeAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: "getbyiduser@test.com" },
    });

    const user = await prisma.user.create({
      data: {
        name: "GetById User",
        email: "getbyiduser@test.com",
        passwordHash: "hashedpassword",
        role: "USER",
      },
    });
    regularUserId = user.id;
    userToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret
    );
  });

  beforeEach(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});

    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Ford",
        model: "Mustang",
        categoryId: "coupe",
        price: 45000,
        quantity: 4,
        description: "Sports car",
      },
    });
    testVehicleId = vehicle.id;
  });

  afterAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { id: regularUserId },
    });
    await prisma.$disconnect();
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app).get(`/api/v1/vehicles/${testVehicleId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 for non-existent vehicle ID", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/non-existent-id")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return vehicle details for valid vehicle ID", async () => {
    const res = await request(app)
      .get(`/api/v1/vehicles/${testVehicleId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testVehicleId);
    expect(res.body.data.make).toBe("Ford");
    expect(res.body.data.model).toBe("Mustang");
  });
});
