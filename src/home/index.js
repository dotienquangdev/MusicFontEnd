import React, { useEffect, useState } from 'react';
import { createSinger } from '../services/singer';

function Home() {
    const [singers, setSingers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(async () => {
        const data = await createSinger();
        setSingers(data.singers);
    }, []);

    return (
        <div>
            <h2>Danh sách ca sĩ</h2>
            {error && <p>{error}</p>}  {/* Hiển thị lỗi nếu có */}
            <ul>
                {singers.length > 0 ? (
                    singers.map(singer => (
                        <li key={singer._id}>
                            <img src={singer.avatar} alt={singer.fullName} width="50" height="50" />
                            {singer.fullName}
                        </li>
                    ))
                ) : (
                    <li>Không có ca sĩ nào</li>
                )}
            </ul>
        </div>
    );
}

export default Home;
