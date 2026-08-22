import { Router } from "express";
import {createListing,getListings,getListingById,updateListing,deleteListing} from "../controllers/listing.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {validateCreateListing} from "../middleware/ListingCreation.middleware.js";
import {logger} from "../middleware/Logger.middleware.js";
const router = Router();

//Anyone can search 

/**
 * @swagger
 * /api/listings:
 *   get:
 *     tags: [Listings]
 *     summary: Get all listings with optional filtering
 *     parameters:
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter listings by location keyword
 *         example: Nasr City
 *       - in: query
 *         name: minPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 2000
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 5000
 *       - in: query
 *         name: roomsAvailable
 *         required: false
 *         schema:
 *           type: number
 *         description: Filter by number of available rooms
 *         example: 2
 *     responses:
 *       200:
 *         description: Successfully retrieved all listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Some server error!
 */
router.get("/",logger ,getListings);
/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     tags: [Listings]
 *     summary: Get a single listing by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the listing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       400:
 *         description: Invalid listing id format
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Some server error!
 */
router.get("/:id",logger, getListingById);
// Need auth and authz
/**
 * @swagger
 * /api/listings:
 *   post:
 *     tags: [Listings]
 *     summary: Create a new listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomsAvailable
 *               - description
 *               - price
 *               - location
 *             properties:
 *               roomsAvailable:
 *                 type: number
 *                 example: 3
 *               description:
 *                 type: string
 *                 example: "Spacious 3-bedroom apartment, fully furnished."
 *               price:
 *                 type: number
 *                 example: 4500
 *               location:
 *                 type: string
 *                 example: "Nasr City, Cairo"
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       400:
 *         description: Bad request - Validation failed
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - You do not have permission to access this resource
 *       500:
 *         description: Some server error!
 */
router.post("/",logger, authenticate, authorize("Lister"), validateCreateListing ,createListing);
/**
 * @swagger
 * /api/listings/{id}:
 *   patch:
 *     tags: [Listings]
 *     summary: Update an existing listing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Listing ID
 *         example: "66ba21c9f4d2a1b3c4d5e6f9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomsAvailable:
 *                 type: number
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: "Spacious 3-bedroom apartment, fully furnished."
 *               price:
 *                 type: number
 *                 example: 5000
 *               location:
 *                 type: string
 *                 example: "Nasr City, Cairo"
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *       400:
 *         description: Bad request - Invalid input data or ID format
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - You can only edit your own listings
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Some server error!
 */
router.patch("/:id",logger, authenticate, authorize("Lister"), updateListing);
/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     tags: [Listings]
 *     summary: Delete a listing by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *       400:
 *         description: Invalid listing id format
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - You can only delete your own listings
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Some server error!
 */
router.delete("/:id",logger, authenticate, authorize("Lister"), deleteListing);

export default router;