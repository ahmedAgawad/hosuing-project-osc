import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
	id: string;
	role: "Lister" | "Seeker";
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies?.token;

	if (!token) {
		res.status(401).json({ message: "access denied no token provided" });
		return;
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as unknown as JwtPayload;

		req.user = {
			id: decoded.id,
			role: decoded.role,
		};

		next();
	} catch (error) {
		res.status(401).json({ message: "invalid or expired token" });
	}
};

export const authorize = (...allowedRoles: Array<"Lister" | "Seeker">) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({ message: "unauthorized user not authenticated" });
			return;
		}

		if (!allowedRoles.includes(req.user.role)) {
			res.status(403).json({
				message: `forbidden access restricted to ${allowedRoles.join(", ")} only`,
			});
			return;
		}

		next();
	};
};
