import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("POST /api/v1/vehicles", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let adminToken: string;
  let userToken: string;
  let adminUserId: string;
  let regularUserId: string;

  beforeAll(async () => {
    // Clean database before tests
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: { in: ["vehicleadmin@test.com", "vehicleuser@test.com"] },
      },
    });

    // Create test users in DB
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "vehicleadmin@test.com",
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
        name: "Regular User",
        email: "vehicleuser@test.com",
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

  afterAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        id: { in: [adminUserId, regularUserId] },
      },
    });
    await prisma.$disconnect();
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app)
      .post("/api/v1/vehicles")
      .send({
        make: "Toyota",
        model: "Camry",
        categoryId: "sedan",
        price: 25000,
        quantity: 5,
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject creation by non-admin user", async () => {
    const res = await request(app)
      .post("/api/v1/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        make: "Toyota",
        model: "Camry",
        categoryId: "sedan",
        price: 25000,
        quantity: 5,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should create a vehicle successfully with valid payload (Admin)", async () => {
    const res = await request(app)
      .post("/api/v1/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Toyota",
        model: "Camry",
        categoryId: "sedan",
        price: 25000,
        quantity: 5,
        description: "Reliable midsize sedan",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.make).toBe("Toyota");
    expect(res.body.data.model).toBe("Camry");
  });

  it("should reject invalid vehicle payload (missing make/model, invalid price)", async () => {
    const res = await request(app)
      .post("/api/v1/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "",
        model: "Camry",
        categoryId: "sedan",
        price: -100,
        quantity: -5,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject duplicate vehicle (same make, model, categoryId)", async () => {
    const res = await request(app)
      .post("/api/v1/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Toyota",
        model: "Camry",
        categoryId: "sedan",
        price: 26000,
        quantity: 3,
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});
