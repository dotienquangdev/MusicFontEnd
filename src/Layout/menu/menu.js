import { NavLink } from "react-router-dom";
import "./menuCss/menu.css";
import { handleMomo } from "../../helper/payment";
import { message } from 'antd';

export default function Menu() {
    const [messageApi, contextHolder] = message.useMessage();

    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userLevel = user?.level || 1;
    console.log(user);

    return (
        <>
            {contextHolder}
            <div id="menu">
                <div className="menu-logo" id="menu-logo">
                    <div className="menu-logo_in">
                        <img
                            className="menu-logo-img"
                            src="https://yt3.googleusercontent.com/ytc/AIdro_kfPqO-m9zcBxusjVAWHXrEVzNn2zFiauJ5D9VKmCBNO8g=s900-c-k-c0x00ffffff-no-rj"
                            alt="ZingMB3"
                        />
                    </div>
                </div>

                <nav className="menu-links">
                    {/* Khám Phá - Mọi level đều thấy */}
                    <NavLink to="/" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                        <i className="fa-brands fa-cc-discover"></i> <span>Khám Phá</span>
                    </NavLink>

                    {/* Thư viện - Ai cũng thấy, nhưng nếu chưa đăng nhập thì cảnh báo */}
                    <NavLink
                        to={user ? "/library" : "#"}
                        onClick={(e) => {
                            if (!user) {
                                e.preventDefault();
                                messageApi.warning("Vui lòng đăng nhập để truy cập Thư Viện");
                            }
                        }}
                        className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
                    >
                        <i className="fa-solid fa-heart"></i> <span>Thư Viện</span>
                    </NavLink>


                    {/* Tổng quan - Level >= 2 */}
                    {userLevel >= 2 && (
                        <NavLink to="/overview" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            <i className="fa-solid fa-radio"></i> <span>Tổng Quan</span>
                        </NavLink>
                    )}

                    {/* Cài đặt - Level == 3 */}
                    {userLevel === 3 && (
                        <NavLink to="/setting" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            <i className="fa-solid fa-gear"></i> <span>Cài đặt</span>
                        </NavLink>
                    )}

                    <div className="menu-section">
                        <NavLink to="/top100" className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}>
                            <i className="fa-solid fa-star"></i> <span>Top 100</span>
                        </NavLink>
                    </div>
                    {userLevel < 3 && (
                        <div div className="upgrade-banner" onClick={() => handleMomo(messageApi)}>
                            <i class="fa-solid fa-caret-up"></i>
                            <div className="upgrade-text">Nghe nhạc không quảng cáo cùng kho nhạc PREMIUM</div>
                            <button className="upgrade-button" >
                                Nâng Cấp Tài Khoản
                            </button>
                        </div>
                    )}

                    <div className="create-playlist">
                        <i className="fa-solid fa-plus"></i> <span>Tạo playlist mới</span>
                    </div>
                </nav >
            </div >
        </>
    );
}
