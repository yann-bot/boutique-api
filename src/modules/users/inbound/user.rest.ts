
import { UserService } from "../core/user.service";
import { Router, type Request, type Response } from "express";
import { createUserSchema } from "../core/user.models";




export default function UserController(service:UserService): Router{
    const router = Router();

    router.post("/", async(req:Request, res:Response)=> {
        const body = createUserSchema.safeParse(req.body)

        if(!body.success) {
          return res.status(400).json({success:false, errors:body.error.issues});
        }

        try{
          const userCreated = await service.createUser(body.data);
          res.status(201).json({ success:true, message:'User created', user: userCreated})
        } catch(err) {
          res.status(500).json({ success: false, message: "Erreur serveur" });
        }
     
    })
  
    router.get("/:email", async(req:Request, res:Response)=> {
        const email = req.params.email;
        if(!email){
           return res.status(400).json({message:"Email manquant"})
        }

        try {
           const userFound = await service.readOneUser(email);
           res.status(200).json({message: "User found", user:userFound})
        } catch(err){
          res.status(500).json({ success: false, message: "Erreur serveur" });
        }
     })

    return router

}