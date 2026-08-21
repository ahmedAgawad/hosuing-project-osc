import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    submitInterestRequest,
    getMyRequestHistory,
    cancelOwnRequest,
    getRequestsForListing,
    updateRequestStatus,
} from "../controllers/InterestRequest.controller.js";

const router = Router();

// Seeker routes
router.post("/submit", authenticate, authorize("Seeker"), submitInterestRequest);
router.get("/my-requests", authenticate, authorize("Seeker"), getMyRequestHistory);
router.delete("/cancel/:id", authenticate, authorize("Seeker"), cancelOwnRequest);

// Lister routes
router.get("/listing/:id", authenticate, authorize("Lister"), getRequestsForListing);
router.patch("/update-status/:id", authenticate, authorize("Lister"), updateRequestStatus);

export default router;