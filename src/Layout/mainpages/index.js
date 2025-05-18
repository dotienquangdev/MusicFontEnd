import { useSelector } from 'react-redux';
import MainMusic from "./musiccontainer/mainMusic";
import MainSinger from "./singercontainer/mainSinger";
import MainTop from "./topconatiner/mainTop";
import MainAbum from "./abumcontainer/mainAbum";
import MainMusictype from "./musictypecontainer/mainMusictype";

import { Helmet } from "react-helmet-async";
export default function MainpageIndex({ title }) {
    const system = useSelector(state => state.systemInfoReducer)
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className="mainPages">
                <span>
                    <MainTop />
                </span>
                <span>
                    <MainMusic />
                </span>
                <span>
                    <MainAbum />
                </span>

                <span>
                    <MainMusictype />
                </span>

                <span>
                    <MainSinger />
                </span>

                <footer className='pt-2 pb-2 mt-4 text-center' style={{ borderTop: "1px solid #3f3f3f", display: "flex", justifyContent: "center", alignItems: "center", height: "100px", color: "#ffffff", fontSize: "20px" }}>
                    {system?.footer || "Đỗ Tiến Quang Project ZingMb3"}

                </footer>
            </div>
        </>
    )
}