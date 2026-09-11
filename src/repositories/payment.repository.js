import pool from "../config/db.js";

 export const createPaymentLedger=async({
    tenantId,
    orderId,
    transactionReference,
    paymentIntentId,
    amount,
    gatewayProvider
 }) => {

    const query = `
    INSERT INTO payment_ledger(
        tenant_id,
        order_id,
        transaction_reference,
        payment_intent_id,
        amount,
        gateway_provider,
        status
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
    RETURNING
    id,
    tenant_id,
    order_id,
    transaction_reference,
    payment_intent_id,
    amount,
    gateway_provider,
    status,
    created_at;

    `;

    const values = [
        tenantId,
        orderId,
        transactionReference,
        paymentIntentId,
        amount,
        gatewayProvider
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
 };



 
 export const updatePaymentLedgerStatus=async({
    paymentIntentId,
    status
 }) => {
    const query = `
    UPDATE payment_ledger
    SET status=$1
    WHERE payment_intent_id=$2
    RETURNING
          id,
          tenant_id,
          order_id,
          transaction_reference,
          payment_intent_id,
          amount,
          gateway_provider,
          status,
          created_at;

    `;

    const values=[
        status,
        paymentIntentId
    ];
    const result = await pool.query(query,values);

    return result.rows[0];
 }




 export const createCashPaymentRequest = async({
    tenantId,
    orderId,
    guestId,
    amount
 })=>{
    const query=`
    INSERT INTO cash_payment_requests(
    tenant_id,
    order_id,
    guest_id,
    amount
    )
    VALUES ($1,$2,$3,$4)
    RETURNING
    id,
    tenant_id,
    order_id,
    guest_id,
    amount,
    status,
    created_at;

    `;

    const values =[
        tenantId,
        orderId,
        guestId,
        amount
    ];
    const result =await pool.query(query,values);

    return result.rows[0];

 }