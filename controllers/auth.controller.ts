import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (userId: string, role: string): string => {
	return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
		expiresIn: "7d",
	});
};

export const register = async (req: Request, res: Response) => {
	try {
		const { fullName, email, password, role } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ message: "email is already in use" });
			return;
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newUser = await User.create({
			fullName,
			email,
			password: hashedPassword,
			role,
		});

		const token = generateToken(newUser._id.toString(), newUser.role);

		res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

		res.status(201).json({
			message: "user registered successfully",
			user: {
				id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				role: newUser.role,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "internal server error during registration", error });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			res.status(401).json({ message: "Invalid email or password" });
			return;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			res.status(401).json({ message: "Invalid email or password" });
			return;
		}

		const token = generateToken(user._id.toString(), user.role);

		res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

		res.status(200).json({
			message: "Login successful",
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "internal server error during login", error });
	}
};

export const logout = async (_req: Request, res: Response) => {
	res.clearCookie("token", { httpOnly: true });
	res.status(200).json({ message: "Logged out successfully" });
};
