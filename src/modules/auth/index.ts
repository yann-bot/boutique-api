
import AuthController from "./inbound/auth.rest";
import { AuthService } from "./core/auth.service";
import { repository } from "../users/index";

const service = new AuthService(repository);
const authRouter = AuthController(service);

export default authRouter;



