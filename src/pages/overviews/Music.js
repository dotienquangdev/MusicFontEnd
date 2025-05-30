import { useEffect, useState } from "react";
import { createSong, deleteSong, editSong } from "../../services/song";
import "./overview.css";
import "./Music.css";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { createSinger } from "../../services/singer";

export default function Music({ item, user }) {
    // console.log(item);
    const [showOptions, setShowOptions] = useState(false);
    const [currentId, setCurrentId] = useState(() => {
        return localStorage.getItem('currentId') || '';
    });
    const location = useLocation();
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        title: ""
    });
    const [likeMessage, setLikeMessage] = useState('');
    const [songs, setSongs] = useState([]);
    const [overviewSong, setOverviewSong] = useState([]);
    const userLevel = user?.level || 1;
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const handleSongChanged = () => {
            const id = localStorage.getItem('currentId');
            setCurrentId(id);
        };

        window.addEventListener('songChanged', handleSongChanged);

        return () => {
            window.removeEventListener('songChanged', handleSongChanged);
        };
    }, []);
    const handleEditClick = async (id) => {
        try {
            const result = await editSong(id);

            if (result && result.data) {
                setEditData({
                    title: result.data.title || "",
                    avatar: result.data.avatar || "",
                    description: result.data.description || "",
                    like: result.data.like || 0,
                    audio: result.data.audio || "",
                    lyrics: result.data.lyrics || "",
                    slug: result.data.slug || "",
                });
                setEditId(id);
                console.log("Kết quả từ editSong:", result);
            } else {
                alert("Không tìm thấy dữ liệu bài hát");
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu bài hát:", error);
            alert("Lỗi lấy dữ liệu bài hát");
        }
    };
    useEffect(() => {
        const fetchSongsAndSingers = async () => {
            try {
                const [songData, singerData] = await Promise.all([
                    createSong(),
                    createSinger()
                ]);
                const singerMap = new Map();

                singerData.singer.forEach(singer => {
                    singerMap.set(singer._id, singer.fullName);
                });
                const songsWithSinger = songData.song.map(song => ({
                    ...song,
                    singerName: singerMap.get(song.singerId) || "Không rõ",
                }));
                setSongs(songsWithSinger);
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSongsAndSingers();
    }, []);
    const handleDeleteSong = async (id) => {
        try {
            await deleteSong(id);
            setOverviewSong(prev => prev.filter(song => song._id !== id));
            alert("Xóa bài hát thành công.");
            console.log(overviewSong);
        } catch (error) {
            console.error("Xóa bài hát thất bại:", error);
            alert("Xóa bài hát thất bại.");
        }
    };
    return (
        <div
            // className="musicFile"
            className={`musicFile  ${currentId === item._id ? 'active' : ''}`}
            onClick={() => {
                localStorage.setItem('queuePlaylist', JSON.stringify(songs));
                localStorage.setItem('currentId', item._id);
                window.dispatchEvent(new Event("songChanged"));
            }}
        >
            <div className="musicFileImg">
                <img className="musicFile-img" src={item.avatar} alt={item.title} />
                <i className="fa-regular fa-square-caret-right musicFileImg-icon"></i>
            </div>
            <span className="musicFile-text">
                <p className="musicFile-textTitle">{item.title}</p>
                <p className="musicFile-textSingerName">{item.singerName}</p>
            </span>
            <div className="musicFile-icon">
                <i className="fa-regular fa-square-caret-right musicIcon musicIconCaret"></i>
                <i
                    className="fa-solid fa-heart musicIcon musicIconHeart"
                    onClick={(e) => {
                        e.stopPropagation();
                        const likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
                        if (!likedSongs.some(item => item._id === item._id)) {
                            likedSongs.push(item);
                            localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
                            setLikeMessage('💖 Đã thêm vào yêu thích!');
                            setTimeout(() => setLikeMessage(''), 3000);
                        }
                    }}
                ></i>
                <i
                    className="fa-solid fa-ellipsis ml-2 musicId musicIcon musicIconEllipsis"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(prev => !prev);
                    }}
                ></i>

            </div>
            <span className="musicFile-button">
                <Link to={`/song/${item._id}`}>
                    <button className="musicFile-buttonEdit">...</button>
                </Link>

                {userLevel === 3 && showOptions &&
                    (location.pathname === "/overview" || location.pathname === "/library") && (
                        <>
                            <button className="musicFile-buttonEdit" onClick={() => handleEditClick(item._id)}>Sửa</button>
                            <button className="musicFile-buttonDelete" onClick={() => handleDeleteSong(item._id)}>Xóa</button>
                        </>
                    )}
            </span>

        </div>
    )
}