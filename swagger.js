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