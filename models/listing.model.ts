import mongoose from "mongoose";


//Listing schema 
const listingSchema = new mongoose.Schema(
  {
    location: { 
        type: String, 
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    roomsAvailable: { 
        type: Number, 
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema)