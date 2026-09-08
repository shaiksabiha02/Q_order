import express from "express";

import { getOrders } from "../controllers/kds_getorder.js";
import { updateStatus } from "../controllers/kds_updatestatus.js";
import { syncKds } from "../controllers/kds_sync.js";
import { printKot } from "../controllers/kds_printkot.js";

const router = express.Router();

router.get("/orders", getOrders);

router.patch("/items/:item_id/status", updateStatus);

router.get("/sync", syncKds);

router.post("/print-kot", printKot);

export default router;