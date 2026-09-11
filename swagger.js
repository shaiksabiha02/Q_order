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

export default swaggerSpec;