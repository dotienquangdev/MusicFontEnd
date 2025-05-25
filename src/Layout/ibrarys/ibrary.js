import { useEffect, useState } from "react";
import "./ibrary.css";
import { createSong } from "../../services/song";

export default function Ibeary() {
    const [song, setSong] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [currentId, setCurrentId] = useState(() => {
        return localStorage.getItem('currentId') || '';
    });

    const [likedSingers, setLikedSingers] = useState([]);

    const toggleLike = (singer) => {
        const exists = likedSingers.find(item => item._id === singer._id);
        let updatedList;
        if (exists) {
            updatedList = likedSingers.filter(item => item._id !== singer._id);
        } else {
            updatedList = [...likedSingers, singer];
        }
        setLikedSingers(updatedList);
        localStorage.setItem("likedSingers", JSON.stringify(updatedList));
    };
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("likedSingers")) || [];
        setLikedSingers(data);
    }, []);

    const removeFromLikedSinger = (id) => {
        const updated = likedSingers.filter(item => item._id !== id);
        setLikedSingers(updated);
        localStorage.setItem("likedSingers", JSON.stringify(updated));
    };
    useEffect(() => {
        const fetchSong = async () => {
            const result = await createSong();
            result.song.sort((a, b) => b.like - a.like);
            data.sort((a, b) => b.like - a.like);
            setSong(result.song);
        }
        const data = JSON.parse(localStorage.getItem('likedSongs')) || [];
        setLikedSongs(data);
        fetchSong();
    }, []);
    const removeFromLiked = (id) => {
        const updatedSongs = likedSongs.filter(song => song._id !== id);
        setLikedSongs(updatedSongs);
        localStorage.setItem('likedSongs', JSON.stringify(updatedSongs));
    };
    useEffect(() => {
        const handleSongChanged = () => {
            const id = localStorage.getItem('currentId');
            setCurrentId(id);
        };
        window.addEventListener('songChanged', handleSongChanged);
        // console.log(currentId);
        return () => {
            window.removeEventListener('songChanged', handleSongChanged);
        };
    }, []);

    return (
        <>
            <div className="ibearySinger-All">
                <h3 className="ibearySinger-h1">Ca sĩ bạn quan tâm</h3>
                <ul className="ibearySinger-All-ul">
                    {likedSingers.length === 0 ? (
                        <p>Chưa có ca sĩ nào được quan tâm.</p>
                    ) : (
                        likedSingers.map(singer => (
                            <li key={singer._id} className="ibearySinger">
                                <img className="ibearySinger-img" src={singer.avatar} alt={singer.fullName} />
                                <i class="fa-regular fa-square-caret-right ibearySingeri"></i>
                                <div className="ibearySinger-info">
                                    <p>{singer.fullName}</p>
                                </div>
                                <div
                                    className="ibearySinger-care"
                                    onClick={() => removeFromLikedSinger(singer._id)}
                                    title="Bỏ quan tâm" >
                                    Bỏ quan tâm
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <h3 className="ibeary-h1">Danh sách các bài hát yêu thích</h3>
            <ul>
                {likedSongs.length === 0 ? (
                    <p>Chưa có bài hát nào được yêu thích.</p>
                ) : (
                    likedSongs.map(song => (
                        <li key={song._id}
                            onClick={() => {
                                localStorage.setItem('queuePlaylist', JSON.stringify(likedSongs));
                                localStorage.setItem('currentId', song._id);
                                window.dispatchEvent(new Event("songChanged"));
                            }}
                            className="ibeary"
                        >
                            <img className="ibeary-img" src={song.avatar !== "z" ? song.avatar : 'default_image.jpg'} alt={song.title} />
                            <div className="Ibeary-info">
                                <p>{song.title}</p>
                                <p>{song.singerName}</p>
                                <p>{song.like} like</p>
                            </div>
                            <i
                                className="fa-solid fa-heart remove-heart Ibeary-icon"
                                title="Bỏ yêu thích"
                                onClick={() => removeFromLiked(song._id)}
                            ></i>
                        </li>
                    ))
                )}
            </ul>
        </>
    );
}