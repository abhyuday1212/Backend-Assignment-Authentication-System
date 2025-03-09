import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: any;
}
export declare const verifyToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
