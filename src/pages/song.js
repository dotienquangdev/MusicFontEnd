import React, { useEffect, useState } from 'react';
import { createSong } from '../services/song';

function Song() {
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(async () => {
        const dataSong = await createSong();
        setSongs(dataSong.songs);
        console.log(dataSong);
        if (dataSong && Array.isArray(dataSong)) {
            setSongs(dataSong);
        } else {
            setError('Không có dữ liệu bài hát');
        }
    }, []);

    return (
        <div className="song">
            <h2>Danh sách bài hát 12341234</h2>
            {error && <p>{error}</p>}
            <ul>
                {songs.length > 0 ? (
                    songs.map(song => (
                        <li
                            key={song._id}
                            display="flex"
                        >
                            <img
                                src={song.avatar !== "z" ? song.avatar : 'default_image.jpg'}
                                alt={song.title}
                                width="50"
                                height="50"
                            />
                            <p>{song.title}</p>
                            hi chao cau
                            <i className="fa-solid fa-heart"></i>
                            <i className="fa-solid fa-ellipsis ml-2"></i>
                        </li>
                    ))
                ) : (
                    <li>Không có bài hát nào</li>
                )}
            </ul>
        </div >
    );

}

export default Song;
