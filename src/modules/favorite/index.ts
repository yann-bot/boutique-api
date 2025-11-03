import { InMemory } from "./outbound/favorite.repository";
import { FavoriteService } from "./core/favorite.service";
import { favoriteController } from "./inbound/favorite.rest";

const repository = new InMemory();
const service = new FavoriteService(repository);
const controller = favoriteController(service);

export default controller;