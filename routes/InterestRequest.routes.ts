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

const router = Router();

// Seeker routes
router.post("/", authenticate, authorize("Seeker"), submitInterestRequest);
router.get("/", authenticate, authorize("Seeker"), getMyRequestHistory);
router.delete("/:id", authenticate, authorize("Seeker"), cancelOwnRequest);

// Lister routes
router.get("/:id", authenticate, authorize("Lister"), getRequestsForListing);
router.patch("/:id", authenticate, authorize("Lister"), validateRequestUpdate, updateRequestStatus);

export default router;