import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import "./src/config/db.js";
import cartRouter from "./src/routes/cart.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import { setupSwagger } from "./swagger.js";
import logger from "./src/config/logger.js";
import kdsRoutes from "./src/routes/kds.routes.js";
import { createKdsSocket } from "./src/sockets/gateways/kds.socket.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.get("/", (req, res) => {
  res.json({
    project: "Q_Order API",
    module: "Module 5: Cart & Shared Table Synchronization",
    status: "online",
    docs: "/api-docs",
    endpoints: {
      getCart: "GET /api/v1/cart",
      addItem: "POST /api/v1/cart/items",
      updateItem: "PUT /api/v1/cart/items/:cart_item_id",
      removeItem: "DELETE /api/v1/cart/items/:cart_item_id",
      clearCart: "DELETE /api/v1/cart/clear"
    }
  });
});

app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/kds", kdsRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Q_Order Server running at http://localhost:${PORT}`);
  logger.info(`Swagger UI: http://localhost:${PORT}/api-docs`);
  logger.info(`Cart API: http://localhost:${PORT}/api/v1/cart`);
});
createKdsSocket(server);
export default app;

app.use(express.json());


/*pool.query("SELECT 1")
  .then(() => {
    logger.info("PostgreSQL connected successfully");
  })
  .catch((error) => {
    logger.error(`PostgreSQL connection failed: ${error.message}`);
  });

app.listen(3000, () => {
  logger.info("Server running on port 3000");
});*/
