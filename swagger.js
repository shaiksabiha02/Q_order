import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
    openapi: "3.0.0",

    info: {
        title: "Q_Order API",
        version: "1.0.0",
        description:
            "API documentation for the Q_Order restaurant ordering platform.",
    },

    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development server",
        },
    ],

    tags: [
        {
            name: "Authentication",
            description: "Staff authentication and QR guest authentication APIs",
        },
        {
            name: "Restaurant",
            description: "Restaurant and branch related APIs",
        },
        {
            name: "Dining Tables",
            description: "Restaurant dining table management APIs",
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

    paths: {
        "/api/v1/auth/qr-handshake": {
            post: {
                tags: ["Authentication"],
                summary: "Create a guest session using a QR code",
                description:
                    "Validates the QR token of a dining table and creates a short-lived guest JWT session.",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: ["qr_token"],

                                properties: {
                                    qr_token: {
                                        type: "string",
                                        example: "qr-secret-t01",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    200: {
                        description: "QR handshake completed successfully",

                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "QR handshake successful",
                                    data: {
                                        access_token: "guest-jwt-token",
                                        token_type: "Bearer",
                                        expires_in: 7200,
                                        table: {
                                            id: "c7956816-79c2-4891-bcf9-8c79721301e5",
                                            floor_id: "GROUND_FLOOR",
                                            table_number: "T-01",
                                            capacity: 4,
                                            status: "VACANT",
                                        },
                                    },
                                },
                            },
                        },
                    },

                    400: {
                        description: "QR token is missing",
                    },

                    401: {
                        description: "Invalid QR token",
                    },
                },
            },
        },

        "/api/v1/auth/staff/login": {
            post: {
                tags: ["Authentication"],
                summary: "Login staff user",
                description:
                    "Authenticates a staff member using username and PIN and returns access and refresh tokens.",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: ["username", "pin"],

                                properties: {
                                    username: {
                                        type: "string",
                                        example: "superadmin",
                                    },

                                    pin: {
                                        type: "string",
                                        example: "1215",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    200: {
                        description: "Staff login successful",

                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Staff login successful",
                                    data: {
                                        access_token: "access-jwt-token",
                                        refresh_token: "refresh-token",
                                        token_type: "Bearer",
                                        expires_in: 3600,
                                        refresh_expires_in: 604800,
                                        user: {
                                            id: "staff-user-id",
                                            username: "superadmin",
                                            role: "SUPER_ADMIN",
                                            tenant_id: "tenant-id",
                                            branch_id: "branch-id",
                                        },
                                    },
                                },
                            },
                        },
                    },

                    400: {
                        description: "Username or PIN is missing",
                    },

                    401: {
                        description: "Invalid username or PIN",
                    },
                },
            },
        },

        "/api/v1/auth/refresh": {
            post: {
                tags: ["Authentication"],
                summary: "Refresh access token",
                description:
                    "Uses a valid refresh token to generate a new access token.",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: ["refresh_token"],

                                properties: {
                                    refresh_token: {
                                        type: "string",
                                        example: "refresh-token",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    200: {
                        description: "Access token refreshed successfully",

                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Token refreshed successfully",
                                    data: {
                                        access_token: "new-access-token",
                                        token_type: "Bearer",
                                        expires_in: 3600,
                                    },
                                },
                            },
                        },
                    },

                    400: {
                        description: "Refresh token is missing",
                    },

                    401: {
                        description: "Invalid, expired, or revoked refresh token",
                    },
                },
            },
        },

        "/api/v1/auth/logout": {
            post: {
                tags: ["Authentication"],
                summary: "Logout staff user",
                description:
                    "Revokes the supplied refresh token and ends the staff session.",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: ["refresh_token"],

                                properties: {
                                    refresh_token: {
                                        type: "string",
                                        example: "refresh-token",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    200: {
                        description: "Logout successful",

                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Logout successful",
                                },
                            },
                        },
                    },

                    400: {
                        description: "Refresh token is missing",
                    },

                    401: {
                        description: "Invalid refresh token",
                    },
                },
            },
        },

        "/api/v1/restaurant/profile": {
            get: {
                tags: ["Restaurant"],
                summary: "Get restaurant profile",
                description:
                    "Returns the restaurant branch information associated with the authenticated staff user.",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                responses: {
                    200: {
                        description: "Restaurant profile fetched successfully",

                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message:
                                        "Restaurant profile fetched successfully",
                                    data: {
                                        id: "branch-id",
                                        tenant_id: "tenant-id",
                                        name: "Q_Order Restaurant",
                                        address: "Main Road",
                                        timezone: "Asia/Kolkata",
                                        currency: "INR",
                                        tax_rate: 18,
                                        created_at:
                                            "2026-09-01T10:00:00.000Z",
                                    },
                                },
                            },
                        },
                    },

                    401: {
                        description: "Authentication token is missing or invalid",
                    },

                    404: {
                        description: "Restaurant profile not found",
                    },
                },
            },
        },

        "/api/v1/staff/tables": {
            get: {
                tags: ["Dining Tables"],
                summary: "Get dining tables",
                description:
                    "Returns all dining tables belonging to the authenticated user's tenant and branch.",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                responses: {
                    200: {
                        description: "Tables fetched successfully",

                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Tables fetched successfully",
                                    data: [
                                        {
                                            id: "c7956816-79c2-4891-bcf9-8c79721301e5",
                                            floor_id: "GROUND_FLOOR",
                                            table_number: "T-01",
                                            capacity: 4,
                                            status: "VACANT",
                                        },
                                    ],
                                },
                            },
                        },
                    },

                    401: {
                        description: "Authentication token is missing or invalid",
                    },

                    500: {
                        description: "Internal server error",
                    },
                },
            },
        },

        "/api/v1/staff/tables/{id}/clear": {
            post: {
                tags: ["Dining Tables"],
                summary: "Clear dining table",
                description:
                    "Changes an occupied or bill-requested table back to VACANT.",

                security: [
                    {
                        bearerAuth: [],
                    },
                ],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string",
                            format: "uuid",
                        },

                        example:
                            "c7956816-79c2-4891-bcf9-8c79721301e5",
                    },
                ],

                responses: {
                    200: {
                        description: "Table cleared successfully",

                        content: {
                            "application/json": {
                                example: {
                                    success: true,
                                    message: "Table cleared successfully",
                                    data: {
                                        id: "c7956816-79c2-4891-bcf9-8c79721301e5",
                                        floor_id: "GROUND_FLOOR",
                                        table_number: "T-01",
                                        capacity: 4,
                                        status: "VACANT",
                                    },
                                },
                            },
                        },
                    },

                    400: {
                        description:
                            "Invalid table ID, missing authentication context, or table is already vacant",
                    },

                    401: {
                        description:
                            "Authentication token is missing or invalid",
                    },

                    404: {
                        description: "Table not found",
                    },
                },
            },
        },
    },
};

const swaggerOptions = {
    definition: swaggerDefinition,
    apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerSpec, swaggerUi };