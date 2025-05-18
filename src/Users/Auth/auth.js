import { NavLink, Outlet } from "react-router-dom";
import "./auth.css";

export default function Auth() {
    return (
        <>
            <div className="account">
                <div className="usaer">
                    <span className="userText">
                        <h1>Zing_mb3</h1>
                        Ứng dụng nghe nhạc cho phép người dùng phát nhạc, tạo playlist,
                        xem lời bài hát và khám phá các thể loại âm nhạc mọi lúc, mọi nơi.
                        <p>Nghe nhạc miễn phí</p>
                        <p>Nâng cấp vĩnh viễn</p>
                        <p>Giao diện đẹp mắt</p>
                        <NavLink className="userText-singer" to={`/`}>Nghe nhạc ngay</NavLink>
                    </span>
                    <div className="userButton">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}