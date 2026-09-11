import{
    getModifierGroups,
    getModifierGroupById,
    createModifierGroup,
    updateModifierGroup,
    deleteModifierGroup
} from '../repositories/modifier-group.repository.js';

export async function getModifierGroupList() {
    return await getModifierGroups();
}

export async function getModifierGroupDetails(id) {
    return await getModifierGroupById(id);
}

export async function addModifierGroup(data) {
    return await createModifierGroup(data);
}

export async function editModifierGroup(id, data) {
    return await updateModifierGroup(id, data);
}

export async function removeModifierGroup(id) {
    return await deleteModifierGroup(id);
}