import express from "express";

import { getOrders } from "../controllers/kdsgetorder.controller.js";
import { updateItemStatus } from "../controllers/kdsupdatestatus.controller.js";
import { syncKds } from "../controllers/kdssync.controller.js";
import { printKot } from "../controllers/kdsprintkot.controller.js";

const router = express.Router();

router.get("/orders", getOrders);

router.patch("/items/:item_id/status", updateItemStatus);

router.get("/sync", syncKds);

router.post("/print-kot", printKot);

export default router;