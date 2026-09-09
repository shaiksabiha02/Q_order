import pool from "../config/db.js";

export const getBillingSummary = async ({
    tenantId,
    orderId
}) => {

    const query = `
        SELECT
            o.subtotal AS subtotal,

            o.tax_amount AS tax,

            COALESCE(c.platform_fee, 0) AS service_charge,

            COALESCE(c.discount, 0) AS discount,

            (
                o.total_amount
                + COALESCE(c.platform_fee, 0)
                
            ) AS total,

            COALESCE(
                SUM(
                    CASE
                        WHEN pl.status = 'CAPTURED'
                        THEN pl.amount
                        ELSE 0
                    END
                ),
                0
            ) AS paid,

            (
                o.total_amount
                + COALESCE(c.platform_fee, 0)
                
            )
            -
            COALESCE(
                SUM(
                    CASE
                        WHEN pl.status = 'CAPTURED'
                        THEN pl.amount
                        ELSE 0
                    END
                ),
                0
            ) AS balance,

            o.created_at

        FROM orders o
        
        LEFT JOIN cart_items ci
             ON o.cart_item_id = ci.id

        LEFT JOIN carts c
             ON ci.cart_id = c.id

        LEFT JOIN payment_ledger pl
             ON pl.order_id = o.id
             
        WHERE o.id = $1
        AND o.tenant_id = $2

        GROUP BY
            o.id,
            o.subtotal,
            o.tax_amount,
            o.total_amount,
            o.created_at,
            c.platform_fee,
            c.discount;
    `;

    const values = [
        orderId,
        tenantId
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};



export const getOrderForSplit = async ({
    tenantId,
    orderId
}) => {

    const query = `
        SELECT
            o.id,
            o.tenant_id,
            o.subtotal,
            o.tax_amount,
            o.total_amount,

            COALESCE(c.platform_fee, 0) AS service_charge,

            COALESCE(c.discount, 0) AS discount,

            (
                o.total_amount
                + COALESCE(c.platform_fee, 0)
                
            ) AS final_total

        FROM orders o

        LEFT JOIN cart_items ci
            ON o.cart_item_id = ci.id

        LEFT JOIN carts c
            ON ci.cart_id = c.id

        WHERE o.id = $1
        AND o.tenant_id = $2;
    `;

    const values = [
        orderId,
        tenantId
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


export const getOrderItemsForSplit = async ({
    orderId
}) => {
     const query=`
     SELECT
          id,
          order_id,
          quantity,
          unit_price
     FROM order_items
     WHERE order_id = $1;

     `;
     const values =[
        orderId
     ];

     const result= await pool.query(query, values);

     return result.rows;
};