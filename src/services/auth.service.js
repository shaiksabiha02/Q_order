import { findUserByUsername } from "../repositories/auth.repository.js";

const login = async (username, password) => {
    const user = await findUserByUsername(username);

    return user;
};

export default {
    login
};