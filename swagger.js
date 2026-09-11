import fs from "fs";

const swaggerDocument = {
swagger: "2.0",

info: {
    title: "Q_ORDER API",
    description: "Q_ORDER Backend API Documentation",
    version: "1.0.0"
},

host: "localhost:3000",
basePath: "/",
schemes: ["http"],

// JWT Authentication Configuration
securityDefinitions: {
    bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description:
            "Enter JWT token with Bearer prefix. Example: Bearer YOUR_TOKEN"
    }
},

paths: {
    "/api/v1/receipts/send-sms": {
        post: {
            tags: ["Receipts"],
            summary: "Send receipt SMS",

            consumes: ["application/json"],
            produces: ["application/json"],

            // Authentication required
            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    in: "body",
                    name: "body",
                    required: true,
                    schema: {
                        type: "object",
                        required: [
                            "phone_number",
                            "message",
                            "receipt_reference"
                        ],
                        properties: {
                            phone_number: {
                                type: "string",
                                example: "+916305063942"
                            },
                            message: {
                                type: "string",
                                example:
                                    "Hello! This is your digital receipt from Q_ORDER."
                            },
                            receipt_reference: {
                                type: "string",
                                example: "REC-1002"
                            }
                        }
                    }
                }
            ],

            responses: {
                200: {
                    description: "Receipt SMS sent successfully"
                },
                400: {
                    description: "Validation failed"
                },
                401: {
                    description: "Unauthorized - Token missing or invalid"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    },

    "/api/v1/feedback": {
        post: {
            tags: ["Feedback"],
            summary: "Create feedback",

            consumes: ["application/json"],
            produces: ["application/json"],

            // Authentication required
            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    in: "body",
                    name: "body",
                    required: true,
                    schema: {
                        type: "object",
                        required: [
                            "tenant_id",
                            "branch_id",
                            "order_id",
                            "rating"
                        ],
                        properties: {
                            tenant_id: {
                                type: "string",
                                example: "TENANT_UUID"
                            },
                            branch_id: {
                                type: "string",
                                example: "BRANCH_UUID"
                            },
                            order_id: {
                                type: "string",
                                example: "ORDER_UUID"
                            },
                            rating: {
                                type: "integer",
                                example: 5
                            },
                            comments: {
                                type: "string",
                                example: "Excellent service"
                            }
                        }
                    }
                }
            ],

            responses: {
                201: {
                    description: "Feedback created successfully"
                },
                400: {
                    description: "Validation failed"
                },
                401: {
                    description: "Unauthorized - Token missing or invalid"
                },
                500: {
                    description: "Internal server error"
                }
            }
        }
    }
}

};

fs.writeFileSync(
"./swagger-output.json",
JSON.stringify(swaggerDocument, null, 2)
);

console.log("Swagger documentation generated successfully!");