import "dotenv/config";
import express from "express";

import logger from "./src/config/logger.js";
import kdsRoutes from "./src/routes/kds.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/v1/kds", kdsRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use(errorMiddleware);
app.listen(3000, () => {
  logger.info("Server running on port 3000");
});
