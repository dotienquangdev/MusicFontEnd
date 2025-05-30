import { _get } from "../utils/requist";

// Get topic, có thể truyền params nếu cần
export const createTopic = async (params) => {
    const response = await _get('/topic', params);
    const result = await response.json();
    return result;
};

export const createTopicId = async (id) => {
    const response = await _get(`/topic/${id}`);
    const result = await response.json();
    return result;
};

