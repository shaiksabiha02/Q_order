import express from "express";
import dotenv from "dotenv";
import "./src/config/db.js";
import logger from "./src/config/logger.js";
import kdsRoutes from "./src/routes/kds.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/kds", kdsRoutes);

app.listen(3000, () => {
 logger.info('Server running on port 3000');
});