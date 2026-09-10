import swaggerAutogen from "swagger-autogen";
import fs from "fs";
import logger from "./src/config/logger.js";

const outputFile = "./swagger-output.json";

const doc = {
    info: {
        title: "Q-Orders API",
        version: "1.0.0",
        description: "Q-Orders Super Admin APIs"
    },

    host: "localhost:3000",
    basePath: "/",
    schemes: ["http"],

    tags: [
        {
            name: "Authentication",
            description: "Super Admin authentication APIs"
        },
        {
            name: "Tenants",
            description: "Tenant management APIs"
        },
        {
            name: "Branches",
            description: "Branch management APIs"
        },
        {
            name: "Payment Gateways",
            description: "Payment gateway management APIs"
        },
        {
            name: "Analytics",
            description: "Analytics APIs"
        }
    ]
};

const endpointsFiles = [
    "./src/routes/v1/auth.routes.js",
    "./src/routes/v1/tenants.routes.js",
    "./src/routes/v1/branches.routes.js",
    "./src/routes/v1/payment_gateways.routes.js",
    "./src/routes/v1/analytics.routes.js"
];

swaggerAutogen()(outputFile, endpointsFiles, doc)
    .then(() => {
        logger.info("Swagger documentation generated successfully");
    })
    .catch((error) => {
        logger.error("Swagger generation error:", error);
    });