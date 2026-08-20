import { Router } from "express";
import {createListing,getListings,getListingById,updateListing,deleteListing} from "../controllers/controllers.listing";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

//Anyone can search
router.get("/", getListings);
router.get("/:id", getListingById);

// Need auth and authz
router.post("/", authenticate, authorize("Lister"), createListing);
router.patch("/:id", authenticate, authorize("Lister"), updateListing);
router.delete("/:id", authenticate, authorize("Lister"), deleteListing);

export default router;