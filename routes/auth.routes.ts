import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// router.get("/test/protected", authenticate, (req, res) => {
// 	res.status(200).json({
// 		message: "authenticated successfully!",
// 		user: req.user,
// 	});
// });

// router.get("/test/lister-only", authenticate, authorize("Lister"), (req, res) => {
// 	res.status(200).json({
// 		message: "welcome lister You have access to listing management",
// 		user: req.user,
// 	});
// });

// router.get("/test/seeker-only", authenticate, authorize("Seeker"), (req, res) => {
// 	res.status(200).json({
// 		message: "welcome seeker! You have access to interest requests",
// 		user: req.user,
// 	});
// });

export default router;
