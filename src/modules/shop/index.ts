
import { ShopDrizzleRepository } from "./outbound/shop.drizzle";
import { ShopService } from "./core/shop.service";
import { shopController } from "./inbound/shop.rest";



const repository = new ShopDrizzleRepository();
const service = new ShopService(repository);
const shopRouter = shopController(service);

export default shopRouter