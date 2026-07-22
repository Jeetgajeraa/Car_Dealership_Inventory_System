import { PurchaseRepository } from "../repositories/purchase.repository";

export class PurchaseService {
  private purchaseRepository = new PurchaseRepository();

  async getUserPurchases(userId: string) {
    return this.purchaseRepository.findByUserId(userId);
  }
}
