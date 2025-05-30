import React, { useEffect, useState } from 'react';
import './mainMusic.css';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { createSong } from '../../../services/song';
import { createSinger } from '../../../services/singer';
import Music from '../../../pages/overviews/Music';

export default function MainMusic() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likeMessage, setLikeMessage] = useState('');
    const [currentId, setCurrentId] = useState(() => {
        return localStorage.getItem('currentId') || '';
    });
    const [likedSongs, setLikedSongs] = useState(() => {
        return JSON.parse(localStorage.getItem('likedSongs')) || [];
    });

    const isLiked = (songId) => likedSongs.some(item => item._id === songId);

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
    return (
        <>
            {likeMessage && (
                <div className="like-toast">{likeMessage}</div>
            )}
            <div className="song">
                <h2>Có Thể Bạn Thích Nghe</h2>
                <ul>
                    <SkeletonTheme baseColor="#372948" highlightColor="#6c5393">
                        {loading ? (
                            <>
                                {[...Array(9)].map((item, index) => (
                                    <li className="song-item song-itemSkeleton" key={index}>
                                        <div className="song-itemImg song-itemSkeletonImg">
                                            <Skeleton />
                                        </div>
                                        <div className="song-itemText song-itemSkeletonText">
                                            <Skeleton />
                                            <Skeleton />
                                        </div>
                                        <span className="song-itemText song-itemSkeletonIcon">
                                            <Skeleton />
                                            <Skeleton />
                                            <Skeleton />
                                        </span>
                                    </li>
                                ))}
                            </>
                        ) : (
                            songs.slice(0, 9).map(song => (
                                <div key={song._id}>
                                    {/* <li
                                        className={`song-item ${currentId === song._id ? 'active' : ''}`}
                                        onClick={() => {
                                            localStorage.setItem('queuePlaylist', JSON.stringify(songs));
                                            localStorage.setItem('currentId', song._id);
                                            window.dispatchEvent(new Event("songChanged"));
                                        }}
                                    >
                                        <div className="song-itemImg">
                                            <img
                                                src={song.avatar !== "z" ? song.avatar : 'default_image.jpg'}
                                                alt={song.title}
                                            />
                                        </div>
                                        <div className="song-itemText">
                                            <p>{song.title}</p>
                                            <p>{song.singerName}</p>
                                        </div>
                                        <span>
                                            <i className="fa-regular fa-square-caret-right"></i>
                                            <i
                                                className={`fa-heart ${isLiked(song._id) ? 'fa-solid text-red-500' : 'fa-regular'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const updatedLikedSongs = [...likedSongs];
                                                    const index = updatedLikedSongs.findIndex(item => item._id === song._id);

                                                    if (index === -1) {
                                                        updatedLikedSongs.push(song);
                                                        setLikeMessage('💖 Đã thêm vào yêu thích!');
                                                    } else {
                                                        updatedLikedSongs.splice(index, 1);
                                                        setLikeMessage('💔 Đã bỏ khỏi yêu thích!');
                                                    }

                                                    setLikedSongs(updatedLikedSongs);
                                                    localStorage.setItem('likedSongs', JSON.stringify(updatedLikedSongs));
                                                    setTimeout(() => setLikeMessage(''), 3000);
                                                }}

                                            ></i>
                                            <Link to={`/song/${song._id}`}>
                                                <i className="fa-solid fa-ellipsis ml-2 musicId"></i>
                                            </Link>
                                        </span>
                                    </li> */}



                                    <Music item={song} user={user} />
                                </div>
                            ))
                        )}
                    </SkeletonTheme>
                </ul>
            </div>
        </>
    );
}

