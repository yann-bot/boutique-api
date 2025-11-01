
import { Router, type Request, type Response } from "express";
import { ShopService } from "../core/shop.service";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../../../lib/auth";
import type { createShopInput } from "../core/shop.models";



export function shopController(service:ShopService):Router {

    const router = Router();

    router.post('/shop', async(req:Request, res:Response) => {
        
        const authz = req.headers.authorization;
        if(!authz){
            return res.status(401).json({error: "You must authenticate yourself"})
        }

        const user = verifyToken(authz, 'admin');
        if(!user){
            return res.status(401).json({error: "You must authenticate yourself"})
        }

        if(user.role !== "admin") {
            return res.status(403).json({error:"You do not have permission"})
        }

        const input:createShopInput = req.body
        if(!input) {
            throw new Error("Missing shop information")
        }
        const result = await service.createShop(input);
        return res.status(201).json({message:'Shop createted', shop:result})
    
    })







    return router;

}