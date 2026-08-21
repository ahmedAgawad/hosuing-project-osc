import { Request, Response, NextFunction } from "express";

export const validateCreateListing = (req: Request, res: Response, next: NextFunction): void => {
	const { location, price, roomsAvailable, description } = req.body;

	if (!location || price === undefined || roomsAvailable === undefined || !description) {
		res.status(400).json({
			message: "location, price, roomsAvailable, and description are required",
		});
		return;
	}

	if (typeof location !== "string" || location.trim().length < 3) {
		res.status(400).json({
			message: "The location must be clear text and at least 3 characters long",
		});
		return;
	}

	if (typeof description !== "string" || description.trim().length < 10) {
		res.status(400).json({
			message: "The description must be detailed text and at least 10 characters long",
		});
		return;
	}

	if (typeof price !== "number" || price <= 0) {
		res.status(400).json({
			message: "The price must be a positive number greater than 0",
		});
		return;
	}

	if (typeof roomsAvailable !== "number" || roomsAvailable <= 0) {
		res.status(400).json({
			message: "The number of rooms must be a positive number",
		});
		return;
	}

	next();
};
