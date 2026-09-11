import {Router} from 'express';
import {OrderController} from '../controllers/order.controller.js';
import {validateSubmitOrder,validateSessionHistory,validateOrderStatus} from '../validators/order.validator.js';

const router = Router();

router.post('/',validateSubmitOrder,OrderController.submitOrder);
router.get('/session-history',validateSessionHistory,OrderController.getSessionHistory);
router.get('/:order_id/status', validateOrderStatus, OrderController.getOrderStatus);
router.patch('/:order_id/status',validateOrderStatus, OrderController.updateOrderStatus);

export default router;