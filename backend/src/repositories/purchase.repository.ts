import prisma from "../prisma";

export class PurchaseRepository {
  async findByUserId(userId: string) {
    return prisma.purchase.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
