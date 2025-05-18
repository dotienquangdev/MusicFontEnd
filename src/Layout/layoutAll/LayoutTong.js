import Header from "../header/header";
import Menu from "../menu/menu";
import { Outlet } from "react-router-dom";
import Playlist from '../playlsit/playList';
import "./layoput.css";
import { useAuth } from "../../helper/AuthContext";

export default function LayoutTong() {
    const { successMessage } = useAuth();  // Lấy thông báo thành công từ context

    return (
        <>
            <div className="menu"><Menu /></div>
            <div className="header"><Header /></div>
            <div className="main-wrapper">
                <div className="mainpage">
                    {successMessage && (
                        <div style={{ color: "green", padding: "1px", textAlign: "center" }}>
                            {successMessage}
                        </div>
                    )}
                    <Outlet />
                </div>
            </div>
            <div className="playlist"><Playlist /></div>
        </>
    );
}
