import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Shaqty API",
			version: "1.0.0",
			description: "A simple API about Student Housing Finder",
		},
		servers: [
			{
				url: process.env.EXTERNAL_URL || "http://localhost:3000",
				description: process.env.EXTERNAL_URL ? "Production server" : "Local server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: [
		"./routes/*.ts",
		"./models/*.ts",
		"./routes/*.js",
		"./models/*.js",
		"./dist/routes/*.js",
		"./dist/models/*.js",
	],
};

export const swaggerSpec = swaggerJSDoc(options);
