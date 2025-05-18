import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/user";
import { useAuth } from "../../helper/AuthContext";  // Import hook useAuth
import { Helmet } from "react-helmet-async";
import "./login.css";

export default function Login({ title }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const { showSuccessMessage } = useAuth();  // Lấy function showSuccessMessage từ context

    const navigate = useNavigate();

    const handleLogin = async () => {
        setEmailError("");
        setPasswordError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let hasError = false;

        if (!email) {
            setEmailError("Vui lòng nhập email.");
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setEmailError("Email không hợp lệ.");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Vui lòng nhập mật khẩu.");
            hasError = true;
        }

        if (hasError) return;

        const result = await loginUser({ email, password });

        if (result.success) {
            localStorage.setItem("user", JSON.stringify(result.user));
            showSuccessMessage("Đăng nhập thành công!");  // Gọi showSuccessMessage từ context
            navigate("/");  // Điều hướng sau khi hiển thị thông báo
        } else {
            if (result.message.includes("Email")) {
                setEmailError(result.message);
            } else if (result.message.includes("Mật khẩu")) {
                setPasswordError(result.message);
            } else {
                setEmailError(result.message); // fallback
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className="userLogin">
                <h1>Đăng Nhập</h1>
                <ul className="userInput">
                    <p>Tài khoản:</p>
                    <input
                        className="userInputName"
                        placeholder="Tài khoản"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                    <br />
                    <p>Mật khẩu:</p>
                    <input
                        className="userInputName"
                        placeholder="Mật khẩu"
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                </ul>

                <div className="userButton">
                    <button onClick={handleLogin}>Đăng Nhập</button>
                    <br />
                    <span>
                        <Link to={`/userForgotPassword`}>Quên mật khẩu</Link>
                        <Link to={`/userRegister`}>Đăng ký</Link>
                    </span>
                </div>
            </div>
        </>
    );
}
