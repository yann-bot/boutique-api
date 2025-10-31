import { Router, type Response, type Request } from "express";


const homeRouter = Router();

homeRouter.get('/', async(req:Request, res:Response) => {
    res.send('Welcome on my boutique-API')
})


export default homeRouter;