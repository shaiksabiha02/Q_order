import {
    getMenuItemList,
    getMenuItemDetails,
    addMenuItem,
    editMenuItem,
    changeMenuItemStock,
} from '../services/menu-item.service.js';

export async function getMenuItems(req, res) {
    const {
        category_id,
        dietary_tag,
        is_available
    } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getMenuItemList({
        category_id,
        dietary_tag,
        is_available:
            is_available === undefined ? undefined : is_available === 'true',
        page,
        limit,
    });

    res.status(200).json(result);
}

export async function getMenuItem(req, res) {
    const result = await getMenuItemDetails(req.params.id);

    if (!result) {
        return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(result);
}

export async function createMenuItemController(req, res) {
    const result = await addMenuItem(req.body);
    res.status(201).json(result);
}

export async function updateMenuItemController(req, res) {
    const result = await editMenuItem(req.params.id, req.body);

    if (!result) {
        return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(result);
}

export async function toggleMenuItemController(req, res) {
    const result = await changeMenuItemStock(req.params.id, req.body.is_available);

    if (!result) {
        return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(result);
}