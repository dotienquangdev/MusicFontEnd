import Song from "../pages/song";
import LayoutTong from "../Layout/layoutAll/LayoutTong";
import MainpageInde from "../Layout/mainpages";
import ZingMp3Clone from "../pages";
import SongDetail from "../Layout/mainpages/musiccontainer/musicContainerItem/musicContainerItem";
import AbumDatail from "../Layout/mainpages/abumcontainer/abumDetail/abumDeatil";
import SingerDetail from "../Layout/mainpages/musictypecontainer/singerDetail/singerDetail";
import Ibeary from "../Layout/ibrarys/ibrary";

export const routes = [
    {
        path: "/",
        element: <LayoutTong />,
        children: [

            {
                path: "/",
                element: <MainpageInde title={`Zing - Khám phá`} />
            },
            {
                path: "/song",
                element: <Song />
            },
            {
                path: "*",
                element: <ZingMp3Clone />
            },
            {
                path: "/song/:id",
                element: <SongDetail />
            },
            {
                path: "/topic/:id",
                element: <AbumDatail />
            },
            {
                path: "/singer/:id",
                element: <SingerDetail />
            },
            {
                path: "/song",
                element: <Song />
            },
            {
                path: "/zing",
                element: <ZingMp3Clone />
            },
            {
                path: "/library",
                element: <Ibeary />
            },
        ]
    },
];