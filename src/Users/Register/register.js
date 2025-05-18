import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { Helmet } from "react-helmet-async";
import { postRegister } from "../../services/user";

export default function Register({ title }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        setError("");

        if (!fullName || !email || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp.");
            return;
        }

        const result = await postRegister({ fullName, email, password });

        console.log(result);
        if (result.success) {
            navigate("/userLogin"); // điều hướng về trang đăng nhập
        } else {
            setError(result.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className="userRegister">
                <h1>Đăng Ký</h1>
                <ul className="userRegister-text">
                    <p>Tài khoản:</p>
                    <input
                        className="userInputRegister"
                        placeholder="Tài khoản"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <p>Email:</p>
                    <input
                        className="userInputRegister"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p>Mật khẩu:</p>
                    <input
                        className="userInputRegister"
                        placeholder="Mật khẩu"
                        // type="password"
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p>Nhập lại mật khẩu:</p>
                    <input
                        className="userInputRegister"
                        placeholder="Nhập lại mật khẩu"
                        // type="password"
                        type="text"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </ul>

                <div className="userRegister-button">
                    <button onClick={handleRegister}>Đăng Ký</button>
                    <br />
                    <span>
                        <Link to={`/userLogin`}>Đăng Nhập</Link>
                    </span>
                </div>
            </div>
        </>
    );
}
