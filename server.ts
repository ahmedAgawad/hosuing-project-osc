import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import dns from "node:dns/promises";
import listingrouter from "./routes/listing.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swaggerConfig.js";
import interestRequestRouter from "./routes/InterestRequest.routes.js";
import cookieParser from "cookie-parser";

dns.setServers(["1.1.1.1"]);

const app = express();
const port = Number(process.env.PORT) || 3000;

// nodemon --exec tsx server.ts

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);

app.use("/api/listings", listingrouter);
app.use("/api/interest-requests", interestRequestRouter);

connectDB().then(() => {
	app.listen(port, "0.0.0.0", () => {
		console.log(`Server is sailing at http://localhost:${port}`);
	});
});
