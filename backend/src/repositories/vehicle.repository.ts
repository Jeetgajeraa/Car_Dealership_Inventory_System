import prisma from "../prisma";

export class VehicleRepository {
  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async findByMakeModelCategory(
    make: string,
    model: string,
    categoryId: string
  ) {
    return prisma.vehicle.findUnique({
      where: {
        make_model_categoryId: {
          make,
          model,
          categoryId,
        },
      },
    });
  }

  async findAll() {
    return prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async search(query: {
    make?: string;
    model?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const where: any = {};

    if (query.make) {
      where.make = { contains: query.make, mode: "insensitive" };
    }

    if (query.model) {
      where.model = { contains: query.model, mode: "insensitive" };
    }

    if (query.categoryId) {
      where.categoryId = { equals: query.categoryId, mode: "insensitive" };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    return prisma.vehicle.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: {
    make: string;
    model: string;
    categoryId: string;
    price: number;
    quantity: number;
    description?: string;
  }) {
    return prisma.vehicle.create({
      data: {
        make: data.make,
        model: data.model,
        categoryId: data.categoryId,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
      },
    });
  }

  async update(
    id: string,
    data: {
      make?: string;
      model?: string;
      categoryId?: string;
      price?: number;
      quantity?: number;
      description?: string;
    }
  ) {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }
}
