import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import logger from "./src/config/logger.js";
import "./src/config/db.js";

dotenv.config();
const app = express();
app.use(express.json());
app.listen(3000,()=>{
    logger.info("Server running on port 3000");
});