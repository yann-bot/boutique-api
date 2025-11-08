import { UserService } from "./core/user.service";
import { UserDrizzleRepository } from "./outbound/user.drizzle";
import  UserController  from "./inbound/user.rest";

export const repository = new UserDrizzleRepository;
const service = new UserService(repository);
const userRouter = UserController(service)


export default userRouter;