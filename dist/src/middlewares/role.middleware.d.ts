import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.ts";
export declare const authorize: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
