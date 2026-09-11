import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./src/config/logger.js";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Q_Order WebSocket API",
            version: "1.0.0",
            description:
                "Q_Order real-time WebSocket gateway documentation",
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
        ],

        paths: {
            "/ws/v1/kds/stream": {
                get: {
                    summary: "KDS WebSocket",
                    description:
                        "WebSocket connection for Kitchen Display System. Authentication is done using a JWT token in the connection query parameter.",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            description: "JWT authentication token",
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        "101": {
                            description:
                                "WebSocket connection established",
                        },
                    },
                },
            },

            "/ws/v1/table-cart": {
                get: {
                    summary: "Shared Table Cart WebSocket",
                    description:
                        "Real-time synchronization of shared table cart changes between guests.",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            description: "Guest JWT authentication token",
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        "101": {
                            description:
                                "WebSocket connection established",
                        },
                    },
                },
            },

            "/ws/v1/orders/track": {
                get: {
                    summary: "Order Tracking WebSocket",
                    description:
                        "Real-time order status updates sent to the guest UI.",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            description: "Guest JWT authentication token",
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        "101": {
                            description:
                                "WebSocket connection established",
                        },
                    },
                },
            },

            "/ws/v1/staff/alerts": {
                get: {
                    summary: "Staff Alerts WebSocket",
                    description:
                        "Real-time service request alerts sent to staff POS.",
                    parameters: [
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            description: "Staff JWT authentication token",
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        "101": {
                            description:
                                "WebSocket connection established",
                        },
                    },
                },
            },
        },
    },

    apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
    );

    logger.info(
        "Swagger API documentation available at: http://localhost:3000/api-docs"
    );
};

export default swaggerSpec;

