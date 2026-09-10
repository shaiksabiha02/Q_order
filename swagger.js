import swaggerAutogen from "swagger-autogen";
import fs from "fs";
import logger from "./src/config/logger.js";

const outputFile = "./swagger-output.json";

const doc = {
    info: {
        title: "Q-Orders API",
        version: "1.0.0",
        description: "Customer Assistance APIs"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ["http"],
    tags: [
        {
            name: "Customer Assistance"
        }
    ]
};

swaggerAutogen()(outputFile, ["./server.js"], doc)
    .then(() => {
        const swagger = JSON.parse(
            fs.readFileSync(outputFile, "utf-8")
        );

        Object.values(swagger.paths).forEach(path => {
            Object.values(path).forEach(operation => {
                operation.tags = ["Customer Assistance"];
            });
        });

        swagger.paths["/api/v1/assistance/request"].post.parameters = [
            {
                name: "body",
                in: "body",
                required: true,
                schema: {
                    type: "object",
                    required: [
                        "id",
                        "guest_id",
                        "table_id",
                        "type"
                    ],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        guest_id: {
                            type: "string",
                            format: "uuid"
                        },
                        table_id: {
                            type: "string",
                            format: "uuid"
                        },
                        type: {
                            type: "string",
                            enum: [
                                "WATER",
                                "BILL",
                                "WAITER"
                            ]
                        },
                        message: {
                            type: "string"
                        }
                    }
                }
            }
        ];

        swagger.paths["/api/v1/staff/assistance-requests"].get.parameters = [
            {
                name: "page",
                in: "query",
                type: "integer",
                minimum: 1
            },
            {
                name: "limit",
                in: "query",
                type: "integer",
                minimum: 1,
                maximum: 100
            }
        ];

        swagger.paths["/api/v1/staff/assistance-requests/{id}"].patch.parameters = [
            {
                name: "id",
                in: "path",
                required: true,
                type: "string",
                format: "uuid"
            },
            {
                name: "body",
                in: "body",
                required: true,
                schema: {
                    type: "object",
                    required: ["status"],
                    properties: {
                        status: {
                            type: "string",
                            enum: ["RESOLVED"]
                        }
                    }
                }
            }
        ];

        delete swagger.tags;

        fs.writeFileSync(
            outputFile,
            JSON.stringify(swagger, null, 2)
        );

        logger.info("Swagger documentation generated successfully");
    })
    .catch(error => {
        logger.error("Swagger documentation generation failed", {
            error: error.message
        });
    });