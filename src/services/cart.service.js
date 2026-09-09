import * as cartRepository from "../repositories/cart.repository.js";

export const getCart = async (data) => {
    return await cartRepository.getCart(data);
};

export const addCartItem = async (data) => {
    const cart = await cartRepository.getActiveCart(data.table_id);

    if (!cart) {
        const error = new Error("Active cart not found");
        error.statusCode = 404;
        throw error;
    }

    return await cartRepository.addCartItem({
        ...data,
        cart_id: cart.id
    });
};

export const updateCartItem = async (id, data) => {
    return await cartRepository.updateCartItem(id, data);
};

export const removeCartItem = async (id) => {
    return await cartRepository.removeCartItem(id);
};

export const clearCart = async (data) => {
    return await cartRepository.clearCart(data);
};