import { UserService } from "./core/user.service";
import { InMemory } from "./outbound/user.repository";
import  UserController  from "./inbound/user.rest";

export const repository = new InMemory();
const service = new UserService(repository);
const userRouter = UserController(service)


export default userRouter;