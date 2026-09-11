import { createFeedback } from "../repositories/feedback.repository.js";

export const submitFeedback = async (data) => {
    return await createFeedback(data);
};