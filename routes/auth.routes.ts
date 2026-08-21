import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {logger} from "../middleware/Logger.middleware";
import {validateRegister} from "../middleware/UserRegistration.middleware";
const router = Router();


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - Validation failed 
 *       500:
 *         description: Some server error!
 */
router.post("/register", logger , validateRegister , register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "student@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful (Returns JWT Token)
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Some server error!
 */
router.post("/login",logger, login);

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
