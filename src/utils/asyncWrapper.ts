import { Request, Response, NextFunction } from "express";

export default (f: any) => {
  console.log("here");

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await f(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};
