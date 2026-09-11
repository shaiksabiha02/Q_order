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
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./src/config/logger.js";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Q-Orders API",
      version: "1.0.0",
      description:
        "Q-Orders Multi-Tenant Restaurant Ordering System APIs including Shared Table Cart and Customer Assistance services.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],

    tags: [
      {
        name: "Cart Module",
        description: "Shared table cart APIs",
      },
      {
        name: "Customer Assistance",
        description: "Customer assistance and staff assistance request APIs",
      },
    ],

    components: {
      parameters: {
        tableIdHeader: {
          name: "x-table-id",
          in: "header",
          description: "Dining Table UUID for shared table ordering",
          required: false,
          schema: {
            type: "string",
            format: "uuid",
            example: "c7956816-79c2-4891-bcf9-8c79721301e5",
          },
        },

        guestIdHeader: {
          name: "x-guest-id",
          in: "header",
          description: "Guest UUID to allocate cart items per guest",
          required: false,
          schema: {
            type: "string",
            format: "uuid",
            example: "9e2467d0-c3d3-41c1-8408-7243c2c10b77",
          },
        },
      },

      schemas: {
        CartItemInput: {
          type: "object",
          required: ["item_id"],
          properties: {
            item_id: {
              type: "string",
              format: "uuid",
              example: "69364de2-aa26-462d-bde2-43ac4cff8bb9",
              description: "Menu Item ID",
            },

            variant_id: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "Optional variant identifier",
            },

            modifier_ids: {
              type: "array",
              items: {
                type: "string",
              },
              example: [],
              description: "Optional modifier / add-on IDs",
            },

            qty: {
              type: "integer",
              minimum: 1,
              default: 1,
              example: 2,
              description: "Quantity of the item to add",
            },

            notes: {
              type: "string",
              example: "Extra spicy, less oil",
              description: "Special cooking instructions",
            },
          },
        },

        UpdateCartItemInput: {
          type: "object",
          properties: {
            qty: {
              type: "integer",
              minimum: 0,
              example: 3,
              description: "Updated quantity (0 removes the item)",
            },

            modifier_ids: {
              type: "array",
              items: {
                type: "string",
              },
              example: [],
              description: "Updated modifier IDs",
            },

            notes: {
              type: "string",
              example: "Make it medium spicy",
              description: "Updated cooking instructions",
            },
          },
        },
      },
    },

    paths: {
      
      "/api/v1/cart": {
        get: {
          tags: ["Cart Module"],
          summary: "Fetch shared table draft cart",
          description:
            "Fetches the draft cart for the dining table, with items allocated per guest_id and full calculation summary.",

          parameters: [
            {
              $ref: "#/components/parameters/tableIdHeader",
            },
            {
              $ref: "#/components/parameters/guestIdHeader",
            },
          ],

          responses: {
            200: {
              description: "Shared table draft cart successfully retrieved",
            },

            400: {
              description: "Bad Request",
            },

            500: {
              description: "Internal Server Error",
            },
          },
        },
      },

      "/api/v1/cart/items": {
        post: {
          tags: ["Cart Module"],
          summary: "Add item to cart",
          description:
            "Adds a menu item to the shared table cart allocated to the requesting guest. Merges quantity if the exact item already exists for this guest.",

          parameters: [
            {
              $ref: "#/components/parameters/tableIdHeader",
            },
            {
              $ref: "#/components/parameters/guestIdHeader",
            },
          ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CartItemInput",
                },
              },
            },
          },

          responses: {
            201: {
              description: "Item successfully added to cart",
            },

            400: {
              description: "Invalid input or item unavailable",
            },

            404: {
              description: "Menu item or table not found",
            },
          },
        },
      },

      "/api/v1/cart/items/{cart_item_id}": {
        put: {
          tags: ["Cart Module"],
          summary: "Update cart item qty/modifiers",
          description:
            "Updates quantity, modifier_ids, or notes for a specific item in the table cart.",

          parameters: [
            {
              name: "cart_item_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Unique ID of the cart item",
            },
          ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateCartItemInput",
                },
              },
            },
          },

          responses: {
            200: {
              description: "Cart item successfully updated",
            },

            404: {
              description: "Cart item not found",
            },
          },
        },

        delete: {
          tags: ["Cart Module"],
          summary: "Remove item from cart",
          description: "Deletes a specific item entry from the table cart.",

          parameters: [
            {
              name: "cart_item_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Unique ID of the cart item",
            },
          ],

          responses: {
            200: {
              description: "Cart item successfully deleted",
            },

            404: {
              description: "Cart item not found",
            },
          },
        },
      },

      "/api/v1/cart/clear": {
        delete: {
          tags: ["Cart Module"],
          summary: "Clear table cart",
          description: "Removes all items from the active table cart.",

          parameters: [
            {
              $ref: "#/components/parameters/tableIdHeader",
            },
          ],

          responses: {
            200: {
              description: "Cart cleared successfully",
            },
          },
        },
      },

      // =========================================================
      // CUSTOMER ASSISTANCE APIs
      // =========================================================

      "/api/v1/assistance/request": {
        post: {
          tags: ["Customer Assistance"],
          summary: "Create customer assistance request",
          description:
            "Allows a guest to request assistance such as WATER, BILL, or WAITER.",

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  type: "object",

                  required: [
                    "id",
                    "guest_id",
                    "table_id",
                    "type",
                  ],

                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                      description: "Assistance request UUID",
                    },

                    guest_id: {
                      type: "string",
                      format: "uuid",
                      description: "Guest UUID",
                    },

                    table_id: {
                      type: "string",
                      format: "uuid",
                      description: "Dining table UUID",
                    },

                    type: {
                      type: "string",
                      enum: [
                        "WATER",
                        "BILL",
                        "WAITER",
                      ],
                      description: "Type of assistance requested",
                    },

                    message: {
                      type: "string",
                      description: "Optional message from the guest",
                    },
                  },
                },
              },
            },
          },

          responses: {
            201: {
              description: "Assistance request created successfully",
            },

            400: {
              description: "Invalid assistance request",
            },

            500: {
              description: "Internal Server Error",
            },
          },
        },
      },

      "/api/v1/staff/assistance-requests": {
        get: {
          tags: ["Customer Assistance"],
          summary: "Get staff assistance requests",
          description:
            "Returns customer assistance requests for staff members with pagination.",

          parameters: [
            {
              name: "page",
              in: "query",
              required: false,
              schema: {
                type: "integer",
                minimum: 1,
                example: 1,
              },
            },

            {
              name: "limit",
              in: "query",
              required: false,
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                example: 10,
              },
            },
          ],

          responses: {
            200: {
              description: "Assistance requests retrieved successfully",
            },

            500: {
              description: "Internal Server Error",
            },
          },
        },
      },

      "/api/v1/staff/assistance-requests/{id}": {
        patch: {
          tags: ["Customer Assistance"],
          summary: "Resolve assistance request",
          description:
            "Updates the status of a customer assistance request.",

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Assistance request UUID",
            },
          ],

          requestBody: {
            required: true,

            content: {
              "application/json": {
                schema: {
                  type: "object",

                  required: ["status"],

                  properties: {
                    status: {
                      type: "string",
                      enum: ["RESOLVED"],
                      description:
                        "New status of the assistance request",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Assistance request updated successfully",
            },

            404: {
              description: "Assistance request not found",
            },

            500: {
              description: "Internal Server Error",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
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
    "./src/routes/adminAuth.routes.js",
    "./src/routes/tenants.routes.js",
    "./src/routes/branches.routes.js",
    "./src/routes/payment_gateways.routes.js",
    "./src/routes/analytics.routes.js"
];

swaggerAutogen()(outputFile, endpointsFiles, doc)
    .then(() => {
        logger.info("Swagger documentation generated successfully");
    })
    .catch((error) => {
        logger.error("Swagger generation error:", error);
    });
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Q Order API",
      version: "1.0.0",
      description: "API documentation for Q Order Payment and Billing modules",
    },
    servers: [
      {
        url: "http://localhost:3000",
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
    tags: [
        {
            name: "Billing",
            description: "Billing and bill splitting APIs",
        },
        {
            name: "Payments",
            description: "Payment and cash request APIs",
        },
    ],
  },
  
  apis: [
    "./src/routes/billing.route.js",
    "./src/routes/payment.route.js",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Q_Order API',
      version: '1.0.0',
      description: 'Menu and Catalog Management APIs',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        MenuItem: {
          type: 'object',
          properties: {
            tenant_id: {
              type: 'string',
              format: 'uuid',
            },
            category_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            base_price: {
              type: 'number',
            },
            image_url: {
              type: 'string',
            },
            dietary_tag: {
              type: 'string',
              enum: ['VEG', 'NON_VEG', 'VEGAN', 'GLUTEN_FREE'],
            },
            is_available: {
              type: 'boolean',
            },
            created_by: {
              type: 'string',
              format: 'uuid',
            },
            station_id: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
        ModifierGroup: {
          type: 'object',
          properties: {
            tenant_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            min_selection: {
              type: 'integer',
            },
            max_selection: {
              type: 'integer',
            },
            created_by: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
        ModifierOption: {
          type: 'object',
          properties: {
            group_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            price_delta: {
              type: 'number',
            },
          },
        },
        ItemModifierGroup: {
          type: 'object',
          properties: {
            item_id: {
              type: 'string',
              format: 'uuid',
            },
            group_id: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
      },
    },
    paths: {
      '/api/v1/menu/categories': {
         get: {
            tags: ['Menu Categories'],
            summary: 'Get menu categories',
            responses: {
                200: {description: 'Categories fetched successfully'
                }
            }
         }
      },
      '/api/v1/menu/items': {
         get: {
            tags: ['Menu Items'],
            summary: 'Get menu items',
            parameters: [
                {
                    name: 'category_id',
                    in:'query',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'dietary_tag',
                    in: 'query',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'is_available',
                    in: 'query',
                    schema: {
                        type: 'boolean'
                    }
                },
                {
                    name: 'page',
                    in: 'query',
                    schema: {
                        type: 'integer',
                        default: 1
                    }
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: {
                        type: 'integer',
                        default: 10
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Menu items fetched successfully'
                }
            }
         }
      },
      '/api/v1/menu/items/{id}': {
         get: {
            tags: ['Menu Items'],
            summary: 'Get menu item by ID',
            parameters: [
                {
                   name: 'id',
                   in: 'path',
                   required: true,
                   schema: {
                   type: 'string'
                   }
                }
            ],
            responses: {
                200: {
                    description: 'Menu item fetched successfully'
                },
                404: {
                    description: 'Menu item not found'
                }
            }
         }
      },
      '/api/v1/admin/menu/items': {
        post: {
            tags: ['Menu Items'],
            summary: 'Create menu item',
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
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/MenuItem'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Menu item created successfully'
                },
                400: {
                    description: 'Validation error'
                }
            }
        }
      },
      '/api/v1/admin/menu/items/{id}': {
         put: {
            tags: ['menu Items'],
            summary: 'Update menu item',
            security: [
                {
                   bearerAuth: []
                }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/MenuItem'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Menu item updated successfully'
                },
                404: {
                    description: 'menu item not found'
                }
            }

         }
      },
      '/api/v1/admin/menu/items/{id}/toggle-stock': {
         patch: {
            tags: ['Menu Items'],
            summary: 'Toggle menu item stock',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['is_available'],
                            properties: {
                                is_available: {
                                    type: 'boolean'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Stock updated successfully'
                }
            }
         }
      },
      '/api/v1/menu/modifier-groups': {
         get: {
            tags: ['Modifier Groups'],
            summary: 'Get modifier groups',
            responses: {
                200: {
                    description: 'Modifier groups fetched successfully'
                }
            }
         }
      },
      '/api/v1/menu/modifier-groups/{id}': {
         get: {
            tags: ['Modifier Groups'],
            summary: 'Get modifier group ny ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: "Modifier group fetched successfully"
                }
            }
         }
      },
      '/api/v1/admin/menu/modifier-groups': {
         post: {
            tags: ['Modifier Groups'],
            summary: 'Create modifier group',
            security: [
                {
                    bearerAuth: []
                }
            ],
            requestBody:{
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ModifierGroup'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Modifier group created successfully'
                }
            }
         }
      },
      '/api/v1/admin/menu/modifier-groups/{id}': {
         put: {
            tags: ['Modifier Groups'],
            summary: 'Update modifier group',
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
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: [
                                'name',
                                'min_selection',
                                'max_selection'
                            ],
                            properties: {
                                name: {
                                    type: 'string'
                                },
                                min_selection: {
                                    type: 'integer'
                                },
                                max_selection: {
                                    type: 'integer'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Modifier group updated successfully'
                }
            }
         },
         delete: {
            tags: ['Modifier Groups'],
            summary: 'Delete modifier group',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Modifier group deleted seccessfully'
                }
            }
         }
      },
      '/api/v1/menu/modifier-options': {
         get: {
            tags: ['Modifier options'],
            summary: 'Get modifier options',
            responses: {
                200: {
                    description: 'Modifier options fetched successfully'
                }
            }
         }
      },
      '/api/v1/menu/modifier-options/{id}': {
         get: {
            tags: ['Modifier options'],
            summary: 'Get modifier option by ID',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Modifier option fetched successfully'
                }
            }
         }
      },
      '/api/v1/admin/menu/modifier-options': {
         post: {
            tags: ['Modifier options'],
            summary: 'Create Modifier option',
            security: [
                {
                    bearerAuth: []
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ModifierOption'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Modifier option created successfully'
                }
            }
         }
      },
      '/api/v1/admin/menu/modifier-options/{id}': {
         put: {
            tags: ['Modifier options'],
            summary: 'Update modifier option',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters:[
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ModifierOption'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Modifier option updated successfully'
                }
            }
         },
         delete: {
            tags: ['Modifier options'],
            summary: 'Delete modifier option',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Modifier option deleted successfully'
                }
            }
         }
      },
      '/api/v1/menu/item-modifier-groups': {
         get: {
            tags: ['Item Modifier Groups'],
            summary: 'Get item modifier groups',
            responses: {
                200: {
                    description: 'Item modifier groups fetched successfully'
                }
            }
         }
      },
      '/api/v1/admin/menu/item-modifier-groups': {
         post: {
            tags: ['Item Modifier Groups'],
            summary: 'Create item modifier group mapping',
            security: [
                {
                    bearerAuth: []
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ItemModifierGroup'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description : 'Mapping created successfully'
                }
            }
         }
      },
      '/api/v1/admin/menu/item-modifier-groups/{item_id}/{group_id}': {
         delete: {
            tags: ['Item Modifier Groups'],
            summary: 'Delete item modifier group mapping',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    name: 'item_id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'group_id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Mapping deleted successfully'
                },
                404: {
                    description: 'Mapping not found'
                }
            }
         }
      }
    },
  },
  apis: ['./src/routes/*.js'],
};


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
