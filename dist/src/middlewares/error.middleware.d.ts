import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiErrors.ts";
export declare const errorHandler: (err: ApiError, req: Request, res: Response, next: NextFunction) => void;
