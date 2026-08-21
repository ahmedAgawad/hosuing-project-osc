import mongoose from "mongoose";



/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         fullName:
 *           type: string
 *           description: The full name of the user
 *         email:
 *           type: string
 *           description: The unique email address of the user
 *         password:
 *           type: string
 *           description: User password
 *         role:
 *           type: string
 *           enum: ["Lister", "Seeker"]
 *           description: User role in the system
 *       example:
 *         fullName: Abdullah Bassem
 *         email: abdullah888880@gmail.com
 *         password: Password123!
 *         role: Lister
 */
const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["Lister", "Seeker"],
			required: true,
		},
	},
	{ timestamps: true },
);

export const User = mongoose.model("User", userSchema);
