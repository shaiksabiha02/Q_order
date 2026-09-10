import express from "express";

import {
    getRestaurantProfile,
} from "../controllers/restaurant.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    getRestaurantProfile
);

export default router;