import analyticsRepository from "../repositories/analytics.repository.js";

const getGMV = async () => {
    return await analyticsRepository.getGMV();
};

export default {
    getGMV
};