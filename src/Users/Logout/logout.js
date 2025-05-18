import { Helmet } from "react-helmet-async";

export default function Logout({ title }) {
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <input placeholder="Tài khoản" />
            <input placeholder="Mật khẩu" />
            Đăng nhập
        </>
    )
}