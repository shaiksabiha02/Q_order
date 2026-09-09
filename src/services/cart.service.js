import * as cartRepository from "../repositories/cart.repository.js";
import { cartEvents } from "../events/cart.event.js";
export const getCart = async (data) => {
    return await cartRepository.getCart(data);
};
export const getCartIdByGuestId = async(guest_id)=>{
    return await cartRepository.getCartIdByGuestId(guest_id);
};
export const addCartItem = async (data) => {
    const cart = await cartRepository.getActiveCart(data.table_id);

    if (!cart) {
        const error = new Error("Active cart not found");
        error.statusCode = 404;
        throw error;
    }

    const result = await cartRepository.addCartItem({
        ...data,
        cart_id:cart.id
    });
    const updatedCart = await cartRepository.getCart({
        table_id:data.table_id
    });
    // this is for websocket
    cartEvents.emit("CART_MUTATED",{
        cart_id:cart.id,
        updated_by_guest_id:data.guest_id,
        cart_items:updatedCart.items
    });
    return result;
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