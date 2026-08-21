import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
	const myDate = new Date().toString();
	console.log(`[${myDate}] ${req.method} ${req.originalUrl}`);
	next();
};
