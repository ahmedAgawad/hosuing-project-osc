import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { logger } from "../middleware/Logger.middleware.js";
import { validateRegister } from "../middleware/UserRegistration.middleware.js";
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
router.post("/register", logger, validateRegister, register);
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
router.post("/login", logger, login);


export default router;
