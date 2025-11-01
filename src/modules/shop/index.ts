import { InMemory } from "./outbound/shop.repository";
import { ShopService } from "./core/shop.service";
import { shopController } from "./inbound/shop.rest";



const repository = new InMemory();
const service = new ShopService(repository);
const shopRouter = shopController(service);

export default shopRouter