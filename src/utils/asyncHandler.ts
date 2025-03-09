/*
asyncHandler is a higher order function that accept a function as a parameter and returns a new function that wraps the original function. The new function will handle the asynchronous operation
*/

import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => next(err));
  };
};

export { asyncHandler };
