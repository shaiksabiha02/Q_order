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
    "./src/routes/auth.routes.js",
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


export default swaggerSpec;
