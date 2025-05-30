import "./musicContainerItem.css";
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

// import { createSinger } from "../../../../services/singer";
import { createSongId, createSongTopicId } from "../../../../services/song";
import { createSinger } from "../../../../services/singer";
import Music from "../../../../pages/overviews/Music";

export default function SongDetail({ title }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [singerName, setSingerName] = useState('');
    const [relatedSongs, setRelatedSongs] = useState([]);

    useEffect(() => {
        const fetchSongAndRelated = async () => {
            try {
                // const res = await fetch(`http://localhost:9000/api/song/${id}`);
                // const res = await fetch(createSongId);
                const data = await createSongId(id)
                setSong(data);
                // Lấy tên ca sĩ
                // const singerRes = await fetch(`http://localhost:9000/api/singer`);
                // const singerData = await singerRes.json(); 
                const singerData = await createSinger();
                const singer = singerData.singer.find(s => s._id === data.singerId);
                // console.log(singerData)

                setSingerName(singer ? singer.fullName : 'Không rõ');

                // Lấy các bài hát cùng chủ đề
                if (data.topicId) {
                    // const relatedRes = await fetch(`http://localhost:9000/api/song?topicId=${data.topicId}`);
                    // const relatedData = await relatedRes.json();
                    const relatedData = await createSongTopicId(data.topicId);
                    // console.log(relatedRes)
                    // console.log(relatedData)
                    // console.log(singerData)
                    // const relatedRes = await fetch(createSongTopicId);
                    setRelatedSongs(relatedData.song.filter(s => s._id !== id));
                }
            } catch (err) {
                console.error("Lỗi khi tải bài hát:", err);
            }
        };

        fetchSongAndRelated();
    }, [id]);

    if (!song) return <div>Đang tải...</div>;

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Link to={`/`}>
                Quay lại
            </Link>
            <div className="song-detail">
                <div className="song-detail-main">
                    <h2>{song.title}</h2>
                    <p>Ca sĩ: {singerName}</p>
                    <img className="song-detail-mainImg" src={song.avatar} alt={song.title} />
                </div>
                <div className="song-detail-mai-text">
                    <h3>Lời bài hát</h3>
                    <div className="lyrics">{song.lyrics || "Chưa có lời bài hát."}</div>
                </div>
                <div className="song-detail-mai-List">
                    <h3 className="song-detail-mai-List_h3">Các bài hát cùng chủ đề</h3>
                    <ul className="song-detail-mai-List_ul">
                        {relatedSongs.map(item => (
                            <li className="song-detail-mai-text-item" key={item._id}>
                                {/* <Link to={`/song/${item._id}`}>
                                    <img src={item.avatar} alt={item.title} />
                                    <span>{item.title}</span>
                                </Link> */}
                                <Music item={item} user={user} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
