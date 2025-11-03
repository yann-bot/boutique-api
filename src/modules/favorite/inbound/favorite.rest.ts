
import { Router, type Request, type Response, type NextFunction } from "express";
import { FavoriteService } from "../core/favorite.service";
import { MissingHeaderAuthorization } from "@/lib/errorHandler";
import { verifyToken } from "@/lib/auth";
import { createFavoriteSchema, type createdFavoriteInput } from "../core/favorite.model";


export function favoriteController(service:FavoriteService):Router {
    const router = Router();

    router.post('/', async(req:Request, res:Response, next: NextFunction) => {
        const authz = req.headers.authorization;
        if(!authz) {
            throw new MissingHeaderAuthorization();
        }
       
        try {
            
            verifyToken(authz); 
            const parsed = createFavoriteSchema.safeParse(req.body);
            if(!parsed.success) {
                return res.status(400).json({ message: 'Invalid favorite data', errors: parsed.error.issues });
            }
            const input: createdFavoriteInput = parsed.data;
            const result = await service.createFavorite(input);
            return res.status(201).json({ message: 'Favorite created', favorite: result });
        } catch (error) {
            next(error);
        }
    })


    return router;
}