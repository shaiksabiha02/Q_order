import {getItemModifierGroups,addItemModifierGroup,removeItemModifierGroup} from '../repositories/item-modifier-group.repository.js';

export async function getItemModifierGroupList() {
    return await getItemModifierGroups();
}   

export async function addItemModifierGroupService(data) {   
    return await addItemModifierGroup(data);
}

export async function removeItemModifierGroupService(item_id, group_id) {
    return await removeItemModifierGroup(item_id, group_id);
}