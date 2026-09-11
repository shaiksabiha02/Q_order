import { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, toggleMenuItemStock } from '../repositories/menu-item.repository.js';
export async function getMenuItemList({ category_id, dietary_tag, is_available , page = 1, limit = 10}) {
    const offset = (page - 1) * limit;
    const result = await getMenuItems({ category_id, dietary_tag, is_available, limit, offset });
    return {data: result.rows,pagination: {page, limit, total: result.total, totalPages: Math.ceil(result.total / limit)}};
}
export async function getMenuItemDetails(id){
    return await getMenuItemById(id);
}
export async function addMenuItem(data){
    return await createMenuItem(data);
}
export async function editMenuItem(id, data){
    return await updateMenuItem(id, data);
}
export async function changeMenuItemStock(id, is_available){
    return await toggleMenuItemStock(id, is_available);
}