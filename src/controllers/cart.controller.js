import * as cartService from "../services/cart.service.js";

export const getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart({
            table_id: req.headers["x-table-id"],
            guest_id: req.headers["x-guest-id"]
        });

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

export const addItem = async (req, res, next) => {
    try {
        const cartItem = await cartService.addCartItem({
            ...req.body,
            table_id: req.headers["x-table-id"],
            guest_id: req.headers["x-guest-id"]
        });

        res.status(201).json({
            success: true,
            data: cartItem
        });
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const cartItem = await cartService.updateCartItem(
            req.params.cart_item_id,
            {
                ...req.body,
                table_id:req.headers["x-table-id"],
                guest_id:req.headers["x-guest-id"]
            }
        );

        res.status(200).json({
            success: true,
            data: cartItem
        });
    } catch (error) {
        next(error);
    }
};

export const removeItem = async (req, res, next) => {
    try {
        const cartItem = await cartService.removeCartItem(
            req.params.cart_item_id,{
                table_id:req.headers["x-table-id"],
                guest_id:req.headers["x-guest-id"]
            }
        );

        res.status(200).json({
            success: true,
            data: cartItem
        });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const result = await cartService.clearCart({
            ...req.body,
            table_id:req.headers["x-table-id"],
            guest_id:req.headers["x-guest-id"]
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};