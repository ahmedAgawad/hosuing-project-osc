import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validateRequestUpdate } from "../middleware/RequestUpdate.middleware.js";
import {
	submitInterestRequest,
	getMyRequestHistory,
	cancelOwnRequest,
	getRequestsForListing,
	updateRequestStatus,
} from "../controllers/InterestRequest.controller.js";
import { logger } from "../middleware/Logger.middleware.js";

const router = Router();

// Seeker routes
/**
 * @swagger
 * /api/interest-requests:
 *   post:
 *     tags: [Interest Requests]
 *     summary: Submit a new interest request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestRequest'
 *     responses:
 *       201:
 *         description: Interest request submitted successfully
 *       400:
 *         description: Bad request - Missing or invalid listing ID
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Only Seekers can submit requests
 *       500:
 *         description: Some server error!
 */
router.post("/",logger, authenticate, authorize("Seeker"), submitInterestRequest);
/**
 * @swagger
 * /api/interest-requests:
 *   get:
 *     tags: [Interest Requests]
 *     summary: Get interest requests history for the logged-in seeker
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved interest requests history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InterestRequest'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Only Seekers can view their request history
 *       500:
 *         description: Some server error!
 */
router.get("/",logger, authenticate, authorize("Seeker"), getMyRequestHistory);
/**
 * @swagger
 * /api/interest-requests/{id}:
 *   delete:
 *     tags: [Interest Requests]
 *     summary: Cancel/Delete a seeker's own interest request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the interest request to cancel
 *         example: 66ba21c9f4d2a1b3c4d5e6f9
 *     responses:
 *       200:
 *         description: Interest request cancelled successfully
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Only Seekers can cancel their own requests
 *       404:
 *         description: Interest request not found
 *       500:
 *         description: Some server error!
 */
router.delete("/:id",logger, authenticate, authorize("Seeker"), cancelOwnRequest);

// Lister routes
/**
 * @swagger
 * /api/interest-requests/listing/{id}:
 *   get:
 *     tags: [Interest Requests]
 *     summary: Get all interest requests for a specific listing (Lister only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing to fetch requests for
 *         example: 66ba21c9f4d2a1b3c4d5e6f7
 *     responses:
 *       200:
 *         description: Successfully retrieved interest requests for the listing
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InterestRequest'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Only Listers can view requests for their listings
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Some server error!
 */
router.get("/listing/:id",logger, authenticate, authorize("Lister"), getRequestsForListing);
/**
 * @swagger
 * /api/interest-requests/{id}:
 *   patch:
 *     tags: [Interest Requests]
 *     summary: Update interest request status (Lister only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the interest request
 *         example: 66ba21c9f4d2a1b3c4d5e6f9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestRequest'
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *       400:
 *         description: Bad request - Invalid status or request data
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Only Listers can update request status
 *       404:
 *         description: Interest request not found
 *       500:
 *         description: Some server error!
 */
router.patch("/:id",logger, authenticate, authorize("Lister"), validateRequestUpdate, updateRequestStatus);

export default router;
