import { Request, Response, NextFunction } from "express";

export default (f: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await f(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};
