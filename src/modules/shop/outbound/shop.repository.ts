import type {Shop , ShopRepository} from "../core/shop.models";





export class InMemory implements ShopRepository {

    private db: Shop[] = []

    create(shop: Shop): Promise<Shop> {
        this.db.push(shop);
        return Promise.resolve(shop)
    }

    readAll():Promise<Shop[]> {
        return Promise.resolve(this.db)
    }

    readOne(id: string):Promise<Shop| undefined>{
        return Promise.resolve(this.db.find(shop => shop.id === id))
    }

    update(id: string, newShop: Shop):Promise<Shop>{
          const shopIndex = this.db.findIndex(shop => shop.id === id)
          this.db[shopIndex] = newShop;
          return Promise.resolve(newShop)
    }

    delete(id: string):Promise<Boolean> {
        const shopIndex = this.db.findIndex(shop => shop.id === id);
        if (shopIndex === -1) {
            return Promise.resolve(false);
        }
        this.db.splice(shopIndex, 1);
        return Promise.resolve(true);
    }
}