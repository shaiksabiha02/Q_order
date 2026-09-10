
import * as cartRepository from "../repositories/cart.repository.js";

import { cartEvents } from "../events/cart.event.js";

export const getCart = async (data) => {
    return await cartRepository.getCart(data);
};


export const getCartIdByGuestId = async (guest_id) => {
    return await cartRepository.getCartIdByGuestId(guest_id);
};


export const addCartItem = async (data) => {

    const cart = await cartRepository.getActiveCart(
        data.table_id,
        data.guest_id
    );

    if (!cart) {
        const error = new Error("Active cart not found");
        error.statusCode = 404;
        throw error;
    }

    const result = await cartRepository.addCartItem({
        ...data,
        cart_id: cart.id
    });

    const updatedCart = await cartRepository.getCart({
        table_id: data.table_id
    });

    // WebSocket event
    cartEvents.emit("CART_MUTATED", {
        cart_id: cart.id,
        updated_by_guest_id: data.guest_id,
        cart_items: updatedCart.items
    });

    return result;
};


export const updateCartItem = async (id, data) => {

    const result = await cartRepository.updateCartItem(id, data);

    if (!result) {
        const error = new Error("Cart item not found");
        error.statusCode = 404;
        throw error;
    }

    const cartId = result.cart_id;

    const cart = await cartRepository.getCart({
        table_id: data.table_id
    });

    // WebSocket event
    cartEvents.emit("CART_MUTATED", {
        cart_id: cartId,
        updated_by_guest_id: data.guest_id,
        cart_items: cart.items
    });

    return result;
};


export const removeCartItem = async (id, data) => {

    const result = await cartRepository.removeCartItem(id);

    if (!result) {
        const error = new Error("Cart item not found");
        error.statusCode = 404;
        throw error;
    }

    const cartId = result.cart_id;

    const cart = await cartRepository.getCart({
        table_id: data.table_id
    });

    // WebSocket event
    cartEvents.emit("CART_MUTATED", {
        cart_id: cartId,
        updated_by_guest_id: data.guest_id,
        cart_items: cart.items
    });

    return result;
};


export const clearCart = async (data) => {

    const result = await cartRepository.clearCart(data);

    const cart = await cartRepository.getCart({
        table_id: data.table_id
    });

    // WebSocket event
    cartEvents.emit("CART_MUTATED", {
        cart_id: data.cart_id,
        updated_by_guest_id: data.guest_id,
        cart_items: cart.items
    });

    return result;
};

