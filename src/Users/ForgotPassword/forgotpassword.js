import { Link } from "react-router-dom";
import "./forgotpassword.css";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import {
    forgotPasswordPost,
    otpPasswordPost,
    resetPasswordPost,
} from "../../services/user";

export default function ForgotPassword({ title }) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP + mật khẩu
    const [loading, setLoading] = useState(false);
    const [tokenUser, setTokenUser] = useState("");
    // Gửi email lấy OTP
    const handleSendOTP = async () => {
        if (!email) {
            setError("Vui lòng nhập email.");
            return;
        }
        console.log(email);
        setError("");
        setLoading(true);
        try {
            const res = await forgotPasswordPost({ email });

            if (res.success) {
                setStep(2);
                setError("Đã gửi mã OTP đến email.");
            } else {
                setError(res.message || "Không gửi được mã OTP.");
            }
        } catch (err) {
            setError("Lỗi khi gửi mã OTP.");
        }
        setLoading(false);
    };


    // Xác nhận OTP và đổi mật khẩu
    const handleResetPassword = async () => {
        if (!otp || !password || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Mật khẩu nhập lại không khớp.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const otpCheck = await otpPasswordPost({ email, otp }); // gọi API trước

            if (!otpCheck.success) {
                setError("OTP không chính xác.");
                setLoading(false);
                return;
            }

            // Truyền tokenUser từ kết quả trả về OTP, không lấy từ state
            const resetRes = await resetPasswordPost({ email, password, tokenUser: otpCheck.tokenUser });
            if (resetRes.success) {
                setError("Đặt lại mật khẩu thành công.");
                // Bạn có thể reset form hoặc chuyển trang ở đây
            } else {
                setError(resetRes.message || "Không thể đặt lại mật khẩu.");
            }
        } catch (err) {
            setError("Lỗi khi đặt lại mật khẩu.");
        }
        setLoading(false);
    };



    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className="userForgotPassword">
                <h1 className="userForgotPassword-h1">Quên mật khẩu</h1>

                {step === 1 && (
                    <>
                        <ul className="userForgotPasswords userForgotPassword-email">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập Email"
                                disabled={loading}
                            />
                        </ul>
                        <button className="otp" onClick={handleSendOTP} disabled={loading}>
                            {loading ? "Đang gửi..." : "Gửi mã OTP"}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <ul className="userForgotPasswords userForgotPassword-emailFixed">
                            <input
                                type="email"
                                value={email}       // giá trị email đã nhập
                                readOnly            // hoặc disabled, để không sửa được
                            />
                        </ul>
                        <ul className="userForgotPasswords userForgotPassword-otp">
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Nhập OTP"
                                disabled={loading}
                            />
                        </ul>
                        <ul className="userForgotPasswords userForgotPassword-password">
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập Password"
                                disabled={loading}
                            />
                        </ul>
                        <ul className="userForgotPasswords userForgotPassword-passwordEnter">
                            <input
                                type="text"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại Password"
                                disabled={loading}
                            />
                        </ul>
                        <button
                            className="userForgotPassword-click"
                            onClick={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                    </>

                )}

                {error && <p style={{ color: "red" }}>{error}</p>}

                <p>
                    <Link to={`/userLogin`}>Quay lại</Link>
                </p>
            </div>
        </>
    );
}
