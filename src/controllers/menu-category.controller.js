import { getCategoryList } from '../services/menu-category.service.js';

export async function getCategories(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await getCategoryList(page, limit);
    res.status(200).json(result);

} 