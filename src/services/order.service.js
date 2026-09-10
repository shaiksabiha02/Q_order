import logger from '../config/logger.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { getOrderGateway } from '../sockets/gateways/order.gateway.js';

export class OrderService {
  static async processOrder(context, payload) {
    const { tenantId, branchId, idempotencyKey } = context;
    const { cart_item_id, tax_rate = 0.05 } = payload;

    if (!idempotencyKey) {
      const error = new Error('X-Idempotency-Key header is mandatory.');
      error.statusCode = 400;
      throw error;
    }

    if (!cart_item_id) {
      const error = new Error('cart_item_id is required in request payload.');
      error.statusCode = 400;
      throw error;
    }

    
    const existingOrder = await OrderRepository.findByIdempotencyKey(tenantId, idempotencyKey);
    if (existingOrder) {
      return {
        message: 'Order already processed (Idempotent response)',
        order_id: existingOrder.id,
        status: existingOrder.status,
        total_amount: existingOrder.total_amount,
        is_duplicate: true
      };
    }

  
    const client = await OrderRepository.getTransactionClient(tenantId);

    try {
      const cartRows = await OrderRepository.getActiveCartWithItems(client, tenantId, cart_item_id);
      
      if (!cartRows || cartRows.length === 0) {
        const error = new Error('Active cart not found or cart is empty.');
        error.statusCode = 400;
        throw error;
      }

      for (const row of cartRows) {
        if (!row.is_available) {
          const error = new Error(`Menu item "${row.item_name}" is currently unavailable.`);
          error.statusCode = 400;
          throw error;
        }
      }

      const tableId = cartRows[0].table_id;
      const guestId = cartRows[0].guest_id;
      const targetBranchId = cartRows[0].branch_id || branchId;
      const discount = parseFloat(cartRows[0].discount || 0);
      const platformFee = parseFloat(cartRows[0].platform_fee || 0);


      let subtotal = 0;
      const orderItemsToInsert = cartRows.map((row) => {
        const unitPrice = parseFloat(row.base_price);
        subtotal += unitPrice * row.qty;
        return {
          item_id: row.item_id,
          qty: row.qty,
          unit_price: unitPrice,
          notes: row.notes
        };
      });

      const discountedSubtotal = Math.max(0, subtotal - discount);
      const taxAmount = parseFloat((discountedSubtotal * parseFloat(tax_rate)).toFixed(2));
      const totalAmount = parseFloat((discountedSubtotal + taxAmount + platformFee).toFixed(2));

      

      const newOrder = await OrderRepository.createOrder(client, {
        tenant_id: tenantId,
        branch_id: targetBranchId,
        table_id: tableId,
        guest_id: guestId,
        idempotency_key: idempotencyKey,
        cart_item_id: cart_item_id,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: 'RECEIVED'
      });

      const createdItems = await OrderRepository.createOrderItems(client, newOrder.id, orderItemsToInsert);

      await OrderRepository.markCartCompleted(client, cart_item_id);

      await client.query('COMMIT');

      try {
        const gateway = getOrderGateway();
        gateway.emitNewOrderToKDS(targetBranchId, {
          order_id: newOrder.id,
          table_id: tableId,
          items: createdItems
        });
      } catch (wsErr) {
        logger.warn("WebSocket notification skipped or failed:", wsErr.message);
      }

      return {
        message: 'Order submitted to kitchen successfully',
        order_id: newOrder.id,
        status: newOrder.status,
        subtotal: newOrder.subtotal,
        tax_amount: newOrder.tax_amount,
        total_amount: newOrder.total_amount
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async getTableSessionHistory(context, tableId) {
    const { tenantId, branchId } = context;
    if (!tableId) {
      const error = new Error('table_id query parameter is required.');
      error.statusCode = 400;
      throw error;
    }
    return await OrderRepository.getSessionHistory(tenantId, branchId, tableId);
  }

  static async getOrderStatus(tenantId, orderId) {
    const order = await OrderRepository.findOrderById(tenantId, orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }
    return {
      order_id: order.id,
      status: order.status,
      created_at: order.created_at
    };
  }

  static async updateOrderStatus(tenantId, orderId, newStatus) {
    const allowedStatuses = ['RECEIVED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'];
    if (!allowedStatuses.includes(newStatus)) {
      const error = new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const updated = await OrderRepository.updateOrderStatus(tenantId, orderId, newStatus);
    if (!updated) {
      const error = new Error('Order not found or update failed.');
      error.statusCode = 404;
      throw error;
    }

    try {
      const gateway = getOrderGateway();
      gateway.emitOrderStatusUpdate(orderId, newStatus);
    } catch (wsErr) {
      logger.warn("WebSocket status update skipped or failed:", wsErr.message);
    }

    return updated;
  }
}