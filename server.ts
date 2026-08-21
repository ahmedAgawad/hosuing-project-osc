import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import dns from "node:dns/promises";
import listingrouter from "./routes/routes.listing.js";
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./config/swaggerConfig.js";

dns.setServers(["1.1.1.1"]);

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);

app.use("/api/listings",listingrouter)

connectDB().then(() => {
	app.listen(port, () => {
		console.log(`Server is sailing at http://localhost:${port}`);
	});
});
