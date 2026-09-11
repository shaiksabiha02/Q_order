import { findUserByUsername } from "../repositories/adminAuth.repository.js";

const login = async (username, password) => {
    const user = await findUserByUsername(username);

    return user;
};

export default {
    login
};