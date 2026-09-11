import {
    getModifierGroupList,
    getModifierGroupDetails,
    addModifierGroup,
    editModifierGroup,
    removeModifierGroup
} from '../services/modifier-group.service.js';

export async function getModifierGroups(req, res) {
    const result = await getModifierGroupList();
    res.status(200).json({ data: result });
}

export async function getModifierGroup(req, res) {
    const result = await getModifierGroupDetails(req.params.id);
    if (!result) {
        return res.status(404).json({ message: 'Modifier group not found' });
    }
    res.status(200).json(result);
}

export async function createModifierGroupController(req, res) {
    const result = await addModifierGroup(req.body);
    res.status(201).json(result);
}

export async function updateModifierGroupController(req, res) {
    const result = await editModifierGroup(req.params.id, req.body);
    if (!result) {
        return res.status(404).json({ message: 'Modifier group not found' });
    }
    res.status(200).json(result);
}

export async function deleteModifierGroupController(req, res) {
    const result = await removeModifierGroup(req.params.id);
    if (!result) {
        return res.status(404).json({ message: 'Modifier group not found' });
    }
    res.status(200).json(result);
}