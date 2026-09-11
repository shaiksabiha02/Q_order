import { Router } from "express";
import {
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart
} from "../controllers/cart.controller.js";
import {
    validateAddCartItem,
    validateUpdateCartItem,
    validateCartItemId
} from "../validators/cart.validator.js";

const router = Router();

router.get("/", getCart);

router.post("/items", validateAddCartItem, addItem);

router.put(
    "/items/:cart_item_id",
    validateUpdateCartItem,
    updateItem
);

router.delete(
    "/items/:cart_item_id",
    validateCartItemId,
    removeItem
);

router.delete("/clear", clearCart);

export default router;