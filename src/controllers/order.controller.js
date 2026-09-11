import { OrderService } from '../services/order.service.js';

export class OrderController {

  static async submitOrder(req, res, next) {
    try {
      const tenantId = req.headers['x-tenant-id'];
      const branchId = req.headers['x-branch-id'];
      const idempotencyKey = req.headers['x-idempotency-key'];

     
      const result = await OrderService.processOrder(
        { tenantId, branchId, idempotencyKey },
        req.body
      );

      return res.status(201).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }


  static async getSessionHistory(req, res, next) {
    try {
      const tenantId = req.headers['x-tenant-id'];
      const branchId = req.headers['x-branch-id'];
      const{table_id} = req.query;

      const history = await OrderService.getTableSessionHistory(
        { tenantId, branchId },
        table_id
      );

      return res.status(200).json({
        success: true,
        data: history
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOrderStatus(req, res, next) {
    try {
      const tenantId = req.headers['x-tenant-id'];
      const{order_id} = req.params;

      
      const statusData = await OrderService.getOrderStatus(tenantId, order_id);

      return res.status(200).json({
        success: true,
        data: statusData
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const tenantId = req.headers['x-tenant-id'];
      const { order_id } = req.params;
      const { status } = req.body;
      
      const updated = await OrderService.updateOrderStatus(tenantId, order_id, status);

      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}