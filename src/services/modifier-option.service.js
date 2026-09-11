import{getModifierOptions,getModifierOptionById,createModifierOption,updateModifierOption,deleteModifierOption}from'../repositories/modifier-option.repository.js';
export async function getModifierOptionList() {
    return await getModifierOptions();
}
export async function getModifierOptionDetails(id) {
    return await getModifierOptionById(id);
}
export async function addModifierOption(data) {
    return await createModifierOption(data);
}
export async function editModifierOption(id, data) {
    return await updateModifierOption(id, data);
}
export async function removeModifierOption(id) {
    return await deleteModifierOption(id);
}
