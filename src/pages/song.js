import React, { useEffect, useState } from 'react';

function Song() {
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:9000/api/song')
            .then(res => res.json())
            .then(data => {
                console.log('Dữ liệu trả về:', data);
                if (data && Array.isArray(data)) {
                    setSongs(data);
                } else {
                    setError('Không có dữ liệu bài hát');
                }
            })
            .catch(err => {
                console.error('Lỗi khi gọi API:', err);
                setError('Không thể lấy dữ liệu từ server');
            });
    }, []);

    return (
        <div class="song">
            <h2>Danh sách bài hát</h2>
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
                            <i class="fa-solid fa-heart"></i>
                            <i class="fa-solid fa-ellipsis ml-2"></i>
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
