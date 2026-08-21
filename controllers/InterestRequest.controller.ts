import { Request, Response } from "express";
import { InterestRequest } from "../models/InterestRequest.model.js";
import { Listing } from "../models/listing.model.js";
import mongoose from "mongoose";

// Seeker: submit a new interest request on a listing
export const submitInterestRequest = async (req: Request, res: Response) => {
	try {
		const seekerId = req.user!.id;
		const { listingId } = req.body;
		if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
			res.status(400).json({ message: "listing ID is required for submitting request" });
			return;
		}
		const listing = await Listing.findById(listingId);
		if (!listing) {
			res.status(404).json({ message: "listing not found for this ID entered" });
			return;
		}
		if (listing.owner.toString() === seekerId) {
			res.status(403).json({ message: "lister cannot submit request on his own listing" });
			return;
		}
		const existingRequest = await InterestRequest.findOne({
			listing: listingId,
			seeker: seekerId,
		});
		if (existingRequest) {
			res.status(400).json({
				message: "You have already submitted an interest request for this listing",
			});
			return;
		}
		const newRequest = await InterestRequest.create({
			listing: listingId,
			seeker: seekerId,
		});
		res.status(201).json({
			message: "interest request submitted successfully",
			request: newRequest,
		});
	} catch (error) {
		res.status(500).json({
			message: "internal server error while submitting interest request",
			error,
		});
	}
};

// Seeker: get their request history
export const getMyRequestHistory = async (req: Request, res: Response) => {
	try {
		const seekerId = req.user!.id;
		const seekerRequests = await InterestRequest.find({ seeker: seekerId });
		if (seekerRequests.length === 0) {
			res.status(200).json({ message: "no results found for user" });
			return;
		}
		res.status(200).json(seekerRequests);
	} catch (error) {
		res.status(500).json({
			message: "internal server error while fetching request history",
			error,
		});
	}
};

// Seeker: cancel own pending request
export const cancelOwnRequest = async (req: Request, res: Response) => {
	try {
		const seekerId = req.user!.id;
		const requestId = req.params.id as string;

		if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
			res.status(400).json({ message: "Invalid request ID format" });
			return;
		}

		const request = await InterestRequest.findById(requestId);

		if (!request) {
			res.status(404).json({ message: "request not found" });
			return;
		}
		if (request.seeker.toString() !== seekerId) {
			res.status(403).json({ message: "you are not the owner of this request" });
			return;
		}
		if (request.status !== "pending") {
			res.status(400).json({ message: "only pending requests can be cancelled" });
			return;
		}
		await InterestRequest.deleteOne({ _id: requestId });
		res.status(200).json({ message: "request cancelled successfully" });
	} catch (error) {
		res.status(500).json({ message: "internal server error while cancelling request", error });
	}
};

// Lister: get all requests for one of their own listings
export const getRequestsForListing = async (req: Request, res: Response) => {
	try {
		const listerId = req.user!.id;
		const { id } = req.params;

		if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({ message: "Invalid listing ID format" });
			return;
		}

		const listing = await Listing.findById(id);

		if (!listing) {
			res.status(404).json({ message: "listing not found" });
			return;
		}
		if (listing.owner.toString() !== listerId) {
			res.status(403).json({ message: "you are not the owner of this listing" });
			return;
		}
		const requests = await InterestRequest.find({ listing: id });
		if (requests.length === 0) {
			res.status(200).json({ message: "no interest requests found for this listing" });
			return;
		}
		res.status(200).json(requests);
	} catch (error) {
		res.status(500).json({ message: "internal server error while fetching requests", error });
	}
};

// Lister: accept or decline a request of their listing
export const updateRequestStatus = async (req: Request, res: Response) => {
	try {
		const listerId = req.user!.id;
		const requestId = req.params.id as string;
		const { status } = req.body;

		if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
			res.status(400).json({ message: "Invalid request ID format" });
			return;
		}

		if (!["accepted", "declined"].includes(status)) {
			res.status(400).json({ message: "invalid status : Must be 'accepted' or 'declined'" });
			return;
		}
		const request = await InterestRequest.findById(requestId);
		if (!request) {
			res.status(404).json({ message: "request not found" });
			return;
		}
		const listing = await Listing.findById(request.listing);
		if (!listing) {
			res.status(404).json({
				message: "listing associated with this request no longer exists",
			});
			return;
		}
		if (listing.owner.toString() !== listerId) {
			res.status(403).json({ message: "you are not the owner of this listing" });
			return;
		}
		if (request.status !== "pending") {
			res.status(400).json({ message: "only pending requests can be updated" });
			return;
		}
		await InterestRequest.findByIdAndUpdate(requestId, { status });
		res.status(200).json({ message: "request status updated successfully" });
	} catch (error) {
		res.status(500).json({
			message: "internal server error while updating request status",
			error,
		});
	}
};
