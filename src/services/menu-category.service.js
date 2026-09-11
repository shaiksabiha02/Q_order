import  { getCategories } from '../repositories/menu-category.repository.js';
export async function getCategoryList(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await getCategories( limit, offset );
    return {data: result.rows,pagination: {page, limit, total: result.total, totalPages: Math.ceil(result.total / limit)}};
}    