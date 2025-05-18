import { _post } from "../utils/requist";
const createMomo = async () => {
    const response = await _post(`/momo/create`);
    const result = await response.json();
    return result;
}


const createMomoUpdate = async () => {
    const res = await _post(`/momo/status`);

    const result = await res.json();

    if (res.ok) {
        return { success: true, user: result.user };
    } else {
        return {
            success: false,
            message: result.message || "Email hoặc mật khẩu không đúng"
        };
    }
};
const createMomoCallback = async () => {
    const res = await _post(`/momo/callback`);
    const result = await res.json();
}
export { createMomo, createMomoUpdate, createMomoCallback }