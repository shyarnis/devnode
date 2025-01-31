import { Request, Response, NextFunction } from 'express';

type AsyncContorller = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => Promise<any>;


const catchErrors = (controller: AsyncContorller): AsyncContorller => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}


export { catchErrors };