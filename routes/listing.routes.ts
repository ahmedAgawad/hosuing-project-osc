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
 *     summary: Get all listings
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
 *     summary: create a new Listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listing'
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
 *         description: The listing ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listing'
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *       400:
 *         description: Bad request - Invalid input data
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