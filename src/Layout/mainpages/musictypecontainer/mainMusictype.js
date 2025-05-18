import React, { useEffect, useState } from 'react';
import "./mainMusictype.css";
import { Link } from 'react-router-dom';
import { createSinger } from '../../../services/singer';

export default function MainMusictype() {
    const [singer, setSingers] = useState([]);

    // useEffect(() => {
    //     fetch('http://localhost:9000/api/singer')
    //         .then(res => res.json())
    //         .then(data => {
    //             // console.log("Data from API:", data);
    //             if (data && Array.isArray(data.singer)) {
    //                 setSingers(data.singer); // sửa ở đây
    //             } else {
    //                 setSingers([]);
    //             }
    //         })
    //         .catch(err => {
    //             console.error("Lỗi fetch API:", err);
    //             setSingers([]);
    //         });
    // }, []);

    useEffect(() => {
        const fetchSinger = async () => {
            const result = await createSinger();
            setSingers(result.singer);
            // console.log(result)
        };
        fetchSinger();
    }, []);
    // console.log(singer)

    return (
        <div className="singer">
            <span>Ca Sỹ Nổi Bật</span>
            <ul>
                {singer.length > 0 ? (
                    singer.slice(0, 5).map(item => (
                        <li key={item._id} className="singer-item">
                            <Link to={`/singer/${item._id}`}>
                                <div className="singer-itemImg">
                                    <img
                                        src={item.avatar}
                                        alt={item.fullName}
                                    />
                                </div>
                                <div className="singer-itemTitle">
                                    <span>{item.fullName}</span>
                                </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>Không có ca sỹ nào</li>
                )}
            </ul>

        </div>
    );
}
