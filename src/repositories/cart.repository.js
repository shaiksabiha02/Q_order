import pool from "../config/db.js";

export const getCart = async (data) => {
    const { table_id } = data;

    const result = await pool.query(
        `SELECT
            c.id,
            c.tenant_id,
            c.branch_id,
            c.table_id,
            c.status,
            c.discount,
            c.platform_fee,
            c.created_at,
            c.updated_at,
            ci.id AS cart_item_id,
            ci.guest_id,
            ci.item_id,
            mi.name AS item_name,
            mi.base_price,
            ci.variant_id,
            ci.modifier_ids,
            ci.qty,
            ci.notes,
            ci.created_at AS item_created_at,
            ci.updated_at AS item_updated_at
        FROM carts c
        LEFT JOIN cart_items ci
            ON c.id = ci.cart_id
        LEFT JOIN menu_items mi
            ON ci.item_id = mi.id
        WHERE c.table_id = $1
          AND c.status = 'ACTIVE'
        ORDER BY ci.created_at`,
        [table_id]
    );

    const rows = result.rows;

    if (!rows.length) {
        return {
            items: [],
            subtotal: 0,
            discount: 0,
            platform_fee: 0,
            total: 0
        };
    }

    const subtotal = rows.reduce((total, item) => {
        return total + (
            Number(item.base_price || 0) * Number(item.qty || 0)
        );
    }, 0);

    const discount = Number(rows[0].discount || 0);
    const platform_fee = Number(rows[0].platform_fee || 0);
    const total = subtotal - discount + platform_fee;

    return {
        items: rows,
        subtotal,
        discount,
        platform_fee,
        total
    };
};
export const getActiveCart = async (table_id) => {
    const result = await pool.query(
        `SELECT *
        FROM carts
        WHERE table_id = $1
          AND status = 'ACTIVE'
        LIMIT 1`,
        [table_id]
    );

    return result.rows[0];
};
export const addCartItem = async (data) => {
    const {
        cart_id,
        guest_id,
        item_id,
        variant_id,
        modifier_ids,
        qty,
        notes
    } = data;

    const result = await pool.query(
        `INSERT INTO cart_items (
            cart_id,
            guest_id,
            item_id,
            variant_id,
            modifier_ids,
            qty,
            notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            cart_id,
            guest_id,
            item_id,
            variant_id || null,
            modifier_ids || [],
            qty,
            notes || null
        ]
    );

    return result.rows[0];
};

export const updateCartItem = async (id, data) => {
    const {
        qty,
        variant_id,
        modifier_ids,
        notes
    } = data;

    const result = await pool.query(
        `UPDATE cart_items
        SET
            qty = COALESCE($1, qty),
            variant_id = COALESCE($2, variant_id),
            modifier_ids = COALESCE($3, modifier_ids),
            notes = COALESCE($4, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *`,
        [
            qty,
            variant_id,
            modifier_ids,
            notes,
            id
        ]
    );

    return result.rows[0];
};

export const removeCartItem = async (id) => {
    const result = await pool.query(
        `DELETE FROM cart_items
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
};

export const clearCart = async (data) => {
    const { cart_id } = data;

    const result = await pool.query(
        `DELETE FROM cart_items
        WHERE cart_id = $1
        RETURNING *`,
        [cart_id]
    );

    return result.rows;
};