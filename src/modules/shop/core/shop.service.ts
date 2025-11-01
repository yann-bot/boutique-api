
import type { createShopInput, Shop, ShopRepository } from "./shop.models";

export class ShopService {
    private repo: ShopRepository;
  
    constructor(repository: ShopRepository) {
      this.repo = repository;
    }
  
    async createShop(partialData: createShopInput): Promise<Shop> {
      const shop: Shop = {
        id: crypto.randomUUID(),
        publishedAt: new Date(),
        ...partialData,
      };
  
      const exists = await this.repo.readOne(shop.id);
      if (exists) {
        throw new Error(`Shop with id ${shop.id} already exists`);
      }
  
      const result = await this.repo.create(shop);
      return result;
    }
  
    async readAllShop(): Promise<Shop[]> {
      const result = await this.repo.readAll();
      return result;
    }
  
    async readOneShop(id: string): Promise<Shop | undefined> {
      const shopFound = await this.repo.readOne(id);
      if (!shopFound) {
        return undefined;
      }
      return shopFound;
    }
  
    async updateShop(id: string, data: Partial<Shop>): Promise<Shop | undefined> {
      const shopFound = await this.repo.readOne(id);
      if (!shopFound) {
        return undefined;
      }
  
      const updatedShop: Shop = {
        ...shopFound,
        ...data,
        id: shopFound.id,
      };
  
      const result = await this.repo.update(id, updatedShop);
      return result;
    }
  
    async deleteShop(id: string): Promise<boolean> {
      const shopFound = await this.repo.readOne(id);
      if (!shopFound) {
        return false;
      }
  
      await this.repo.delete(id);
      return true;
    }
  }
  