import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import prisma from "../../prisma";

describe("GET /api/v1/vehicles/search", () => {
  const secret = process.env.JWT_SECRET || "default_secret";
  let userToken: string;
  let testUserId: string;

  beforeAll(async () => {
    await prisma.purchase.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: "searchuser@test.com" },
    });

    const user = await prisma.user.create({
      data: {
        name: "Search User",
        email: "searchuser@test.com",
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

    // Seed test vehicles
    await prisma.vehicle.createMany({
      data: [
        {
          make: "Toyota",
          model: "Camry",
          categoryId: "sedan",
          price: 25000,
          quantity: 5,
        },
        {
          make: "Toyota",
          model: "RAV4",
          categoryId: "suv",
          price: 32000,
          quantity: 3,
        },
        {
          make: "Honda",
          model: "Civic",
          categoryId: "sedan",
          price: 22000,
          quantity: 4,
        },
        {
          make: "Ford",
          model: "Mustang",
          categoryId: "sports",
          price: 45000,
          quantity: 2,
        },
      ],
    });
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
    const res = await request(app).get("/api/v1/vehicles/search?make=Toyota");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should filter vehicles by make", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/search?make=Toyota")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data.every((v: any) => v.make === "Toyota")).toBe(true);
  });

  it("should filter vehicles by model", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/search?model=Civic")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].model).toBe("Civic");
  });

  it("should filter vehicles by categoryId", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/search?categoryId=sedan")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it("should filter vehicles by price range (minPrice and maxPrice)", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/search?minPrice=20000&maxPrice=30000")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2); // Camry (25k), Civic (22k)
  });

  it("should combine multiple filters", async () => {
    const res = await request(app)
      .get("/api/v1/vehicles/search?make=Toyota&categoryId=suv")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].model).toBe("RAV4");
  });
});
