import mongoose from "mongoose";

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