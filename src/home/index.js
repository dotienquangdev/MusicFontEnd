import React, { useEffect, useState } from 'react';

function Home() {
    const [singers, setSingers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:9000/api/singer')
            .then(res => res.json())
            .then(data => {
                console.log('Dữ liệu trả về:', data);  // Debug dữ liệu trả về
                if (data.singer) {  // Kiểm tra nếu trường singer có dữ liệu
                    setSingers(data.singer);  // Cập nhật dữ liệu từ trường singer
                } else {
                    setError('Không có dữ liệu ca sĩ');
                }
            })
            .catch(err => {
                console.error('Lỗi khi gọi API:', err);
                setError('Không thể lấy dữ liệu từ server');
            });
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
