import {
    getModifierOptionList,
    getModifierOptionDetails,
    addModifierOption,
    editModifierOption,
    removeModifierOption
} from '../services/modifier-option.service.js';

export async function getModifierOptions(req, res) {
    const result = await getModifierOptionList();
    res.status(200).json({ data: result });
}

export async function getModifierOption(req, res) {
    const result = await getModifierOptionDetails(req.params.id);
    if (!result) {
        return res.status(404).json({ message: 'Modifier option not found' });
    }
    res.status(200).json(result);
}

export async function createModifierOptionController(req, res) {
    const result = await addModifierOption(req.body);
    res.status(201).json(result);
}

export async function updateModifierOptionController(req, res) {
    const result = await editModifierOption(req.params.id, req.body);
    if (!result) {
        return res.status(404).json({ message: 'Modifier option not found' });
    }
    res.status(200).json(result);
}

export async function deleteModifierOptionController(req, res) {
    const result = await removeModifierOption(req.params.id);
    if (!result) {
        return res.status(404).json({ message: 'Modifier option not found' });
    }
    res.status(200).json(result);
}