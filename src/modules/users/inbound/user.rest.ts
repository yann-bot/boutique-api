
import { UserService } from "../core/user.service";
import { Router, type Request, type Response, type NextFunction } from "express";
import { createUserSchema, updateUserSchema } from "../core/user.models";
import { UserNotFoundError, DuplicateUserError } from "../../../lib/errorHandler";




export default function UserController(service:UserService): Router{
    const router = Router();

    router.post("/", async(req:Request, res:Response, next: NextFunction)=> {
        const body = createUserSchema.safeParse(req.body)

        if(!body.success) {
          return res.status(400).json({success:false, errors:body.error.issues});
        }

        try{
          const userCreated = await service.createUser(body.data);
          const { password, ...safeUser } = userCreated;
          res.status(201).json({ success:true, message:'User created', user: safeUser })
        } catch(err:any) {
          if (typeof err.message === 'string' && err.message.includes('already exists')) {
            return next(new DuplicateUserError(body.data.email));
          }
          next(err);
        }
     
    })
  
    router.get("/:email", async(req:Request, res:Response, next: NextFunction)=> {
        const email = req.params.email;
        if(!email){
           return res.status(400).json({message:"Email manquant"})
        }

        try {
           const userFound = await service.readOneUser(email);
           if(!userFound){
              throw new UserNotFoundError(email);
           }
           const { password, ...safeUser } = userFound;
           res.status(200).json({message: "User found", user:safeUser})
        } catch(err){
          next(err);
        }
     })

    router.put("/:email", async(req:Request, res:Response, next: NextFunction)=> {
        const email = req.params.email;
        if(!email){
           return res.status(400).json({message:"Email manquant"})
        }
        const body = updateUserSchema.safeParse(req.body)
        if(!body.success) {
           return res.status(400).json({message:'Invalid user data', errors: body.error.issues});
        }
        try {
           const updated = await service.updateUser(email, body.data);
           if(!updated){
             throw new UserNotFoundError(email);
           }
           const { password, ...safeUser } = updated;
           res.status(200).json({message: 'User updated', user: safeUser});
        } catch(err){
           next(err);
        }
    })

    router.delete("/:email", async(req:Request, res:Response, next: NextFunction)=> {
        const email = req.params.email;
        if(!email){
           return res.status(400).json({message:"Email manquant"})
        }
        try {
           const deleted = await service.deleteUser(email);
           if(!deleted){
              throw new UserNotFoundError(email);
           }
           res.status(200).json({message: 'User deleted'});
        } catch(err){
           next(err);
        }
    })

    return router

}