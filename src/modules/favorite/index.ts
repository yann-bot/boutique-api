
import { FavoriteDrizzleRepository } from "./outbound/favorite.drizzle";
import { FavoriteService } from "./core/favorite.service";
import { favoriteController } from "./inbound/favorite.rest";

const repository = new FavoriteDrizzleRepository();
const service = new FavoriteService(repository);
const controller = favoriteController(service);

export default controller;