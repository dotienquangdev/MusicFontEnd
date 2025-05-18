import { useRoutes } from "react-router-dom";
import { routes } from "../router";
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSystem } from "../services/system";
import { systemInfo } from "../actions/system";

import Song from "../pages/song";
import LayoutTong from "../Layout/layoutAll/LayoutTong";
import MainpageInde from "../Layout/mainpages";
import ZingMp3Clone from "../pages";
import SongDetail from "../Layout/mainpages/musiccontainer/musicContainerItem/musicContainerItem";
import AbumDatail from "../Layout/mainpages/abumcontainer/abumDetail/abumDeatil";
import SingerDetail from "../Layout/mainpages/musictypecontainer/singerDetail/singerDetail";
import Ibeary from "../Layout/ibrarys/ibrary";


import Auth from "../Users/Auth/auth";
import Login from "../Users/Login/longin";
import Logout from "../Users/Logout/logout";
import Register from "../Users/Register/register";
import ForgotPassword from "../Users/ForgotPassword/forgotpassword";
import Overview from "../pages/overviews/overview";
function AllRouter() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSystem = async () => {
            const result = await getSystem();
            dispatch(systemInfo(result))
        };
        fetchSystem();
    }, []);
    const system = useSelector(state => state.systemInfoReducer);

    const elements = useRoutes(routes);
    return (
        <>
            {/* {elements} */}
            <HelmetProvider>
                <Routes>
                    <Route element={<Auth />}>
                        <Route path="/userLogin" element={< Login title={`${system?.siteName || "Zing"}-Đăng Nhập`} />}></Route>
                        <Route path="/userLogout" element={< Logout title={`${system?.siteName || "Zing"}-Đăng Nhập`} />}></Route>
                        <Route path="/userRegister" element={< Register title={`${system?.siteName || "Zing"}-Đăng ký`} />}></Route>
                        <Route path="/userForgotPassword" element={< ForgotPassword title={`${system?.siteName || "Zing"}-Đổi mật khẩu`} />}></Route>

                    </Route>

                    <Route path="/" element={<LayoutTong />}>

                        <Route path="/" element={<MainpageInde title={`${system?.siteName || "Zing"}-Khám phá`} />}></Route>
                        <Route path="/song" element={<Song title={`${system?.siteName || "Zing"}-Bài hát`} />}></Route>

                        <Route path="*" element={<ZingMp3Clone />}></Route>

                        <Route path="/song/:id" element={<SongDetail title={`${system?.siteName || "Zing"}-Bài hát`} />}></Route>
                        <Route path="/topic/:id" element={<AbumDatail title={`${system?.siteName || "Zing"}-Abum`} />}></Route>
                        <Route path="/singer/:id" element={<SingerDetail title={`${system?.siteName || "Zing"} - Ca sỹ`} />}></Route>
                        <Route path="/song" element={<Song />}></Route>
                        <Route path="/zing" element={<ZingMp3Clone />}></Route>

                        <Route path="/library" element={<Ibeary title={`${system?.siteName || "Zing"}-Thư Viện`} />}></Route>
                        <Route path="/zingchart" element={<SingerDetail title={`${system?.siteName || "Zing"}-Zing chát`} />}></Route>
                        <Route path="/overview" element={<Overview title={`${system?.siteName || "Zing"}-Tổng Quan`} />}></Route>
                        <Route path="/setting" element={<SingerDetail title={`${system?.siteName || "Zing"}-Cài Đặt`} />}></Route>
                        <Route path="/newmusic" element={<SingerDetail title={`${system?.siteName || "Zing"}-Nhạc Mới`} />}></Route>
                        <Route path="/topics" element={<SingerDetail title={`${system?.siteName || "Zing"}-Chủ đề-Thể loại`} />}></Route>
                        <Route path="/top100" element={<SingerDetail title={`${system?.siteName || "Zing"}-Top 100`} />}></Route>


                    </Route>
                </Routes>
            </HelmetProvider >
        </>
    )
}

export default AllRouter;