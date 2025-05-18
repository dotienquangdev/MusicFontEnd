import { useEffect, useState } from "react";
import "./ibrary.css";
import { createSong } from "../../services/song";

export default function Ibeary() {
    const [song, setSong] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [currentId, setCurrentId] = useState(() => {
        return localStorage.getItem('currentId') || '';
    });

    useEffect(() => {
        const fetchSong = async () => {
            const result = await createSong();
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
            <h1 className="ibeary-h1">Danh sách các bài hát yêu thích</h1>
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
