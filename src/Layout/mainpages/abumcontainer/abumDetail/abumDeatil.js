import './abumDetail.css';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
export default function AbumDetail({ title }) {
    const { id } = useParams();
    const [songs, setSongs] = useState([]);
    const [topic, setTopic] = useState(null);
    const [relatedSongs, setRelatedSongs] = useState([]);

    const [currentId, setCurrentId] = useState(() => {
        return localStorage.getItem('currentId') || '';
    });

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
    console.log(songs)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch chủ đề
                const topicRes = await fetch(`http://localhost:9000/api/topic/${id}`);
                const topicData = await topicRes.json();
                setTopic(topicData);
                // Fetch tất cả bài hát
                const songRes = await fetch(`http://localhost:9000/api/song`);
                const songData = await songRes.json();
                // Fetch danh sách ca sĩ
                const singerRes = await fetch('http://localhost:9000/api/singer');
                const singerData = await singerRes.json();
                const singerMap = new Map();

                singerData.singer.forEach(singer => {
                    singerMap.set(singer._id, singer.fullName);
                });

                const songsWithSinger = songData.song.map(song => ({
                    ...song,
                    singerName: singerMap.get(song.singerId) || "Không rõ",
                }));
                setSongs(songsWithSinger);

                // Lọc bài hát có topicId đúng với id chủ đề
                const filteredSongs = songData.song.filter(song => song.topicId === id);
                setRelatedSongs(filteredSongs);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            }
        };
        fetchData();
    }, [id]);
    if (!topic) return <div>Đang tải...</div>;
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Link to={`/`}>Quay lại</Link>

            <div className='topic-detail'>
                <div className='topic-detail-main'>
                    <h2>{topic.title}</h2>
                    <img src={topic.avatar} alt={topic.title} />
                    <p>{topic.description}</p>
                </div>

                <div className='topic-detail-item'>
                    <h2>Danh sách bài hát</h2>
                    {relatedSongs.length > 0 ? (
                        <ul>
                            {relatedSongs.map(song => (
                                <li key={song._id}
                                    className={`song-item ${currentId === song._id ? 'active' : ''}`}
                                    onClick={() => {
                                        localStorage.setItem('queuePlaylist', JSON.stringify(relatedSongs));
                                        localStorage.setItem('currentId', song._id);
                                        window.dispatchEvent(new Event("songChanged"));
                                    }}
                                >
                                    <Link className='songItem-detail' to={`/song/${song._id}`}>
                                        <img src={song.avatar} alt={song.title} />
                                        <span>{song.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Chưa có bài hát nào cho chủ đề này.</p>
                    )}
                </div>
            </div>
        </>
    );
}
