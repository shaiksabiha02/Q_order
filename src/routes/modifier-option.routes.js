import express from 'express';
import { getModifierOptions, getModifierOption, createModifierOptionController, updateModifierOptionController, deleteModifierOptionController } from '../controllers/modifier-option.controller.js';
import { validateCreateModifierOption, validateUpdateModifierOption } from '../validators/modifier-option.validator.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/menu/modifier-Options', getModifierOptions);
router.get('/menu/modifier-Options/:id', getModifierOption);
router.post('/admin/menu/modifier-Options', authMiddleware, validateCreateModifierOption, createModifierOptionController);
router.put('/admin/menu/modifier-Options/:id', authMiddleware, validateUpdateModifierOption, updateModifierOptionController);
router.delete('/admin/menu/modifier-Options/:id', authMiddleware, deleteModifierOptionController);

export default router;