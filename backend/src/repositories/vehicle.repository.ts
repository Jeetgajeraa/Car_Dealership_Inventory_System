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
    createdById?: string;
  }) {
    return prisma.vehicle.create({
      data: {
        make: data.make,
        model: data.model,
        categoryId: data.categoryId,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
        createdById: data.createdById,
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

  async findByCreatedById(userId: string) {
    return prisma.vehicle.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      // Remove purchase history first to satisfy FK constraint
      await tx.purchase.deleteMany({ where: { vehicleId: id } });
      return tx.vehicle.delete({ where: { id } });
    });
  }

  async purchase(vehicleId: string, userId: string, quantity: number) {
    return prisma.$transaction(async (tx) => {
      const updatedVehicle = await tx.vehicle.update({
        where: { id: vehicleId },
        data: { quantity: { decrement: quantity } },
      });

      const purchase = await tx.purchase.create({
        data: {
          userId,
          vehicleId,
          quantity,
          totalPrice: Number(updatedVehicle.price) * quantity,
        },
      });

      return { vehicle: updatedVehicle, purchase };
    });
  }

  async restock(vehicleId: string, quantity: number) {
    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: { quantity: { increment: quantity } },
    });
  }

  async getStats() {
    const totalVehicles = await prisma.vehicle.count();
    const stockAgg = await prisma.vehicle.aggregate({
      _sum: { quantity: true },
    });
    const outOfStockCount = await prisma.vehicle.count({
      where: { quantity: 0 },
    });
    const purchaseAgg = await prisma.purchase.aggregate({
      _count: { id: true },
      _sum: { totalPrice: true },
    });

    const allVehicles = await prisma.vehicle.findMany({
      select: { price: true, quantity: true },
    });
    const totalInventoryValue = allVehicles.reduce(
      (acc, v) => acc + Number(v.price) * v.quantity,
      0
    );

    return {
      totalVehicles,
      totalUnits: stockAgg._sum.quantity || 0,
      totalInventoryValue,
      outOfStockCount,
      totalPurchases: purchaseAgg._count.id || 0,
      totalRevenue: Number(purchaseAgg._sum.totalPrice || 0),
    };
  }
}
