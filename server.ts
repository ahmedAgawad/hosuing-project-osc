import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1"]);

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


app.use("/api/auth", authRoutes);

connectDB().then(() => {
	app.listen(port, () => {
		console.log(`Server is sailing at http://localhost:${port}`);
	});
});
