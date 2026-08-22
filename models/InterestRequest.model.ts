import mongoose from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     InterestRequest:
 *       type: object
 *       required:
 *         - listing
 *         - seeker
 *       properties:
 *         listingId:
 *           type: string
 *           description: The ID of the listing being requested
 *         seeker:
 *           type: string
 *           description: The User ID of the seeker
 *         status:
 *           type: string
 *           enum: ["pending", "accepted", "declined"]
 *           default: "pending"
 *           description: Current status of the interest request
 *       example:
 *         listing: 66ba21c9f4d2a1b3c4d5e6f7
 *         seeker: 66ba21c9f4d2a1b3c4d5e6f8
 *         status: pending
 */
const interestRequestSchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true
        },
        seeker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending"
        }
    },
    { timestamps: true }
);

export const InterestRequest = mongoose.model("InterestRequest", interestRequestSchema);