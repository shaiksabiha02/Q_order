import express from 'express';
import {getItemModifierGroups,createItemModifierGroupController,deleteItemModifierGroupController} from '../controllers/item-modifier-group.controller.js';
import { validateItemModifierGroup } from '../validators/item-modifier-group.validator.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/menu/item-modifier-groups', getItemModifierGroups);
router.post('/admin/menu/item-modifier-groups',authMiddleware,validateItemModifierGroup,createItemModifierGroupController);
router.delete('/admin/menu/item-modifier-groups/:item_id/:group_id',authMiddleware,deleteItemModifierGroupController);

export default router;