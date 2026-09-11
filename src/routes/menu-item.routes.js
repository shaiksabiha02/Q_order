import express from 'express';
import { getMenuItems, getMenuItem, createMenuItemController, updateMenuItemController, toggleMenuItemController } from '../controllers/menu-item.controller.js';
import { validateCreateMenuItem, validateUpdateMenuItem, validateToggleStock } from '../validators/menu-item.validator.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/menu/items', getMenuItems);
router.get('/menu/items/:id', getMenuItem);
router.post('/admin/menu/items', authMiddleware, validateCreateMenuItem, createMenuItemController);
router.put('/admin/menu/items/:id', authMiddleware, validateUpdateMenuItem, updateMenuItemController);
router.patch('/admin/menu/items/:id/toggle-stock', authMiddleware, validateToggleStock, toggleMenuItemController);

export default router;