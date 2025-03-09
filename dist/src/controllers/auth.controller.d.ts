import { Request, Response } from "express";
export declare const registerUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const loginUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const generateNewRefreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
