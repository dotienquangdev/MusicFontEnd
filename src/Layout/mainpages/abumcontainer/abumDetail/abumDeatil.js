import './abumDetail.css';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { createSong } from '../../../../services/song';
import { createSinger } from '../../../../services/singer';
import { createTopicId } from '../../../../services/topic';
import Music from '../../../../pages/overviews/Music';
export default function AbumDetail({ title }) {
    const { id } = useParams();
    const [songs, setSongs] = useState([]);
    const [topic, setTopic] = useState(null);
    const [relatedSongs, setRelatedSongs] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const topicData = await createTopicId(id);
                setTopic(topicData);

                const songData = await createSong();
                const singerData = await createSinger();
                const singerMap = new Map();
                // console.log(songs);

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
                                    className={`song-itemDetail ${currentId === song._id ? 'active' : ''}`}
                                    onClick={() => {
                                        localStorage.setItem('queuePlaylist', JSON.stringify(relatedSongs));
                                        localStorage.setItem('currentId', song._id);
                                        window.dispatchEvent(new Event("songChanged"));
                                    }}
                                >
                                    <Link className='songItem-detail' to={`/song/${song._id}`}>
                                        <Music item={song} user={user} />
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
