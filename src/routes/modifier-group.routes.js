import express from 'express';
import { getModifierGroups, getModifierGroup, createModifierGroupController, updateModifierGroupController, deleteModifierGroupController } from '../controllers/modifier-group.controller.js';
import { validateCreateModifierGroup, validateUpdateModifierGroup } from '../validators/modifier-group.validator.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/menu/modifier-groups', getModifierGroups);
router.get('/menu/modifier-groups/:id', getModifierGroup);
router.post('/admin/menu/modifier-groups', authMiddleware, validateCreateModifierGroup, createModifierGroupController);
router.put('/admin/menu/modifier-groups/:id', authMiddleware, validateUpdateModifierGroup, updateModifierGroupController);
router.delete('/admin/menu/modifier-groups/:id', authMiddleware, deleteModifierGroupController);

export default router;