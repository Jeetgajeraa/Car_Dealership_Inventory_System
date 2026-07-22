import prisma from "../prisma";

export class VehicleRepository {
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
}
