import mongoose from "mongoose";


/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     Listing:
 *       type: object
 *       required:
 *         - location
 *         - price
 *         - roomsAvailable
 *         - description
 *         - owner
 *       properties:
 *         location:
 *           type: string
 *           description: The location of the flat
 *         price:
 *           type: number
 *           description: The monthly rent price
 *         roomsAvailable:
 *           type: number
 *           description: Number of available rooms in the flat
 *         description:
 *           type: string
 *           description: Detailed description of the apartment and rules
 *         owner:
 *           type: string
 *           description: The User ID of the flat owner
 *       example: 
 *          location: Cairo, Nasr City
 *          price: 4500
 *          roomsAvailable: 3
 *          description: Fully furnished 3-bedroom apartment near the main road
 *          owner:knouuguKnnuiuh887878
 * 
 * 
 */ 



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