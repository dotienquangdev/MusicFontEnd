// src/helper/payment.js
import { createMomo } from "../services/momo";

export const handleMomo = async (messageApi) => {
    try {
        const res = await createMomo();
        if (res && res.payUrl) {
            window.location.href = res.payUrl;
        } else {
            messageApi.error("Không tạo được thanh toán MoMo");
        }
    } catch (err) {
        messageApi.error("Có lỗi xảy ra khi gọi MoMo");
    }
};
