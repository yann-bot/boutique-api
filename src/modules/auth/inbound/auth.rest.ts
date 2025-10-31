import  { Router, type Request, type Response } from "express";
import type { AuthService } from "../core/auth.service";
import { userLoginSchema, type LoginInput } from "../core/auth.models";
import { UserNotFoundError, InvalidPasswordError } from "../../../lib/errorHandler";




export default function AuthController(service:AuthService): Router {
    const router = Router();
   
    router.post('/login', async(req:Request, res:Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const parsed = userLoginSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({ message: "Invalid input data", errors: parsed.error.issues });
        }
      
        const input: LoginInput = parsed.data;
      
        try {
            const result= await service.login(input);
            return res.status(200).json({message:"Connected", result: result})
        } catch(error) {
            if (error instanceof UserNotFoundError) {
                res.status(404).json({ message: error.message });
            } 

            if(error instanceof InvalidPasswordError){
                res.status(401).json({ message: error.message });
            }


            return res.status(500).json("An server error occurs")
        }
          
    })

    router.get('/', async(req:Request, res:Response) => {
        res.send("I'm a zombie");
    })

   

    return router;

}