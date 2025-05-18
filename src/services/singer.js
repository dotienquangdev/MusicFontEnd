import { _get } from "../utils/requist";

export const createSinger = async (data) => {
    const response = await _get(`/singer`, data);
    const result = await response.json();
    return result;
}