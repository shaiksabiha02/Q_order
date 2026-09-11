import {getItemModifierGroupList,addItemModifierGroupService,removeItemModifierGroupService} from '../services/item-modifier-group.service.js';

export async function getItemModifierGroups(req, res) {
    const result = await getItemModifierGroupList();
    res.status(200).json({data: result});
}

export async function createItemModifierGroupController(req, res) {
    const result = await addItemModifierGroupService(req.body);
    res.status(201).json(result);
}

export async function deleteItemModifierGroupController(req, res) {
    const result = await removeItemModifierGroupService(req.params.item_id, req.params.group_id);
    if (!result) {
        return res.status(404).json({message: 'Item modifier group mapping not found'});
    }
    res.status(200).json(result);
}