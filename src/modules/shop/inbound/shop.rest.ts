
import { Router, type Request, type Response, type NextFunction } from "express";
import { ShopService } from "../core/shop.service";
import { verifyToken } from "../../../lib/auth";
import type { createShopInput } from "../core/shop.models";



export function shopController(service:ShopService):Router {

    const router = Router();

    router.post('/', async(req:Request, res:Response, next: NextFunction) => {
        const authz = req.headers.authorization;
        if(!authz){
            return res.status(401).json({error: "You must authentificate yourself"})
        }
        try {
            verifyToken(authz, 'admin');
            const input:createShopInput = req.body;
            if(!input) {
                throw new Error("Missing shop information")
            }
            const result = await service.createShop(input);

        return res.status(201).json({message:'Shop created', shop:result})
        } catch(error) {
             
             next(error) 
        }
       
    })


    router.get('/', async(req:Request, res:Response, next: NextFunction) => {
        try {
            const result = await service.readAllShop();
            return res.status(200).json({message:'Shops found', shops:result})
        } catch(error) {
            next(error)
        }
    });

    router.get("/:id", async(req:Request, res:Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if(!id) {
                throw new Error("Missing shop id")
            }
            const result = await service.readOneShop(id);
            return res.status(200).json({message:'Shop found', shop:result})
        } catch(error) {
            next(error)
        }
    });

    router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
        const authz = req.headers.authorization;
        if (!authz) {
            return res.status(401).json({ error: "You must authentificate yourself" });
        }
        try {
            verifyToken(authz, "admin");
            const id = req.params.id;
            if (!id) {
                throw new Error("Missing shop id");
            }
            const deleted = await service.deleteShop(id);
            if (!deleted) {
                return res.status(404).json({ error: "Shop not found" });
            }
            return res.status(200).json({ message: "Shop deleted" });
        } catch (error) {
            next(error);
        }
    });



    return router;

}