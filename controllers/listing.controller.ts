import { Request, Response } from "express";
import { Listing } from "../models/listing.model.js";
import { InterestRequest } from "../models/InterestRequest.model.js";
import mongoose from "mongoose";

// Create a listing
export const createListing = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				message: "Unauthorized",
			});
		}

		const { location, price, roomsAvailable, description } = req.body;
		const owner = req.user.id;

		const listing = await Listing.create({
			location,
			price,
			roomsAvailable,
			description,
			owner,
		});

		res.status(201).json(listing);
	} catch (error) {
		res.status(500).json({
			message: "Failed to create listing",
			error,
		});
	}
};

// Search and filter listings
export const getListings = async (req: Request, res: Response) => {
	try {
		const { location, minPrice, maxPrice, roomsAvailable } = req.query;

		const query: any = {};

		if (location) {
			query.location = { $regex: String(location), $options: "i" };
		}

		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice);
			if (maxPrice) query.price.$lte = Number(maxPrice);
		}

		if (roomsAvailable) {
			query.roomsAvailable = Number(roomsAvailable);
		}

		const listings = await Listing.find(query).populate("owner", "fullName email");

		res.status(200).json(listings);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch listings",
			error,
		});
	}
};

// Search a specific listing
export const getListingById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({ message: "Invalid listing ID format" });
			return;
		}

		const listing = await Listing.findById(id).populate("owner", "fullName email");

		if (!listing) {
			return res.status(404).json({
				message: "Listing not found",
			});
		}

		res.status(200).json(listing);
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch listing",
			error,
		});
	}
};

// Update listing
export const updateListing = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({ message: "Invalid listing ID format" });
			return;
		}

		const listing = await Listing.findById(id);

		if (!listing) {
			return res.status(404).json({
				message: "Listing not found",
			});
		}

		if (listing.owner.toString() !== req.user?.id) {
			return res.status(403).json({
				message: "You can only edit your own listings",
			});
		}

		const { location, price, roomsAvailable, description } = req.body;

		if (price !== undefined && (typeof price !== "number" || price <= 0)) {
			res.status(400).json({ message: "Price must be a positive number" });
			return;
		}

		if (location) listing.location = location;
		if (price) listing.price = price;
		if (roomsAvailable) listing.roomsAvailable = roomsAvailable;
		if (description) listing.description = description;

		await listing.save();

		res.status(200).json(listing);
	} catch (error) {
		res.status(500).json({
			message: "Failed to update listing",
			error,
		});
	}
};

// Delete
export const deleteListing = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({ message: "invalid listing ID format" });
			return;
		}

		const listing = await Listing.findById(id);

		if (!listing) {
			return res.status(404).json({
				message: "Listing not found",
			});
		}

		if (listing.owner.toString() !== req.user?.id) {
			return res.status(403).json({
				message: "You can only delete your own listings",
			});
		}

		const hasAcceptedRequest = await InterestRequest.findOne({
			listing: id,
			status: "accepted",
		});

		if (hasAcceptedRequest) {
			return res.status(400).json({
				message: "Cannot delete a listing with accepted interest requests",
			});
		}

		await listing.deleteOne();

		res.status(200).json({
			message: "Listing deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to delete listing",
			error,
		});
	}
};
