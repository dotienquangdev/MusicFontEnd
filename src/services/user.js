import { _delete, _get, _post } from "../utils/requist";
const loginUsers = async (data) => {
    const response = await _get(`/user/login`, data);
    const result = await response.json();
    return result;
}


const loginUser = async ({ email, password }) => {
    try {
        const res = await _post(`/user/login`, { email, password });

        const result = await res.json();

        if (res.ok) {
            return { success: true, user: result.user };
        } else {
            return {
                success: false,
                message: result.message || "Email hoặc mật khẩu không đúng"
            };
        }
    } catch (err) {
        return {
            success: false,
            message: err.message || "Lỗi kết nối đến máy chủ"
        };
    }
};
const loginUserDelete = async (data) => {
    const response = await _get(`/user/loginDeleted`, data);
    const result = await response.json();
    return result;
};

const deleteUser = async (id) => {
    const response = await _delete(`/user/delete/${id}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
    return await response.json();
}

const deleteUserDelete = async (id) => {
    const response = await _delete(`/user/deleted/${id}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
    return await response.json();
}


// Gọi API đăng ký tài khoản
const postRegister = async ({ fullName, email, password }) => {
    try {
        const res = await _post(`/user/register`, { fullName, email, password });
        const result = await res.json();

        if (res.ok) {
            return { success: true, user: result.user };
        } else {
            return {
                success: false,
                message: result.message || "Đăng ký không thành công"
            };
        }
    } catch (err) {
        return {
            success: false,
            message: err.message || "Lỗi kết nối đến máy chủ"
        };
    }
};

const forgotPasswordPost = async (email) => {
    try {
        const res = await _post(`/user/forgot`, { email });
        const result = await res.json();

        if (result.success) {
            alert("Vui lòng kiểm tra email để nhập OTP.");
        } else {
            alert(result.message || "Đã xảy ra lỗi.");
        }

        return result;
    } catch (error) {
        alert(error.message || "Lỗi kết nối máy chủ.");
        return {
            success: false,
            message: error.message || "Lỗi kết nối máy chủ.",
        };
    }
};

const otpPasswordPost = async ({ email, otp }) => {
    try {
        const res = await _post(`/user/otp`, { email, otp });
        const result = await res.json();

        if (result.success) {
            alert("OTP hợp lệ. Đang chuyển đến trang đặt lại mật khẩu...");
            localStorage.setItem("tokenUser", result.tokenUser);
        } else {
            alert(result.message || "Mã OTP không hợp lệ.");
        }
        console.log(result);

        return result;
    } catch (error) {
        alert(error.message || "Lỗi xác minh OTP.");
        return { success: false };
    }
};

const resetPasswordPost = async ({ email, password }) => {
    const tokenUser = localStorage.getItem("tokenUser");

    try {
        const res = await _post(`/user/reset`, {
            email,
            password,
            tokenUser
        });

        const rawText = await res.text(); // luôn đọc dưới dạng text để debug lỗi JSON
        console.log("Raw response text:", rawText);

        let result;
        try {
            result = JSON.parse(rawText);
        } catch (err) {
            console.error("Lỗi parse JSON:", err);
            return { success: false, message: "Server không trả về JSON." };
        }

        console.log("resulttttt:", result);

        if (result.success) {
            alert("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
            window.location.href = "/login";
        } else {
            alert(result.message || "Không thể đặt lại mật khẩu.");
        }

        return result;

    } catch (error) {
        alert(error.message || "Lỗi kết nối khi đặt lại mật khẩu.");
        return { success: false };
    }
};



export { loginUser, loginUserDelete, loginUsers, deleteUser, deleteUserDelete, postRegister, forgotPasswordPost, otpPasswordPost, resetPasswordPost };
