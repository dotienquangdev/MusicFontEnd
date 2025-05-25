import React, { useEffect, useState } from 'react';
import "./mainMusictype.css";
import { Link } from 'react-router-dom';
import { createSinger } from '../../../services/singer';

export default function MainMusictype() {
    const [singer, setSingers] = useState([]);
    const [likeMessage, setLikeMessage] = useState('');
    const [likedSingers, setLikedSingers] = useState(() => {
        return JSON.parse(localStorage.getItem("likedSingers")) || [];
    });
    const toggleLike = (singer) => {
        const exists = likedSingers.find(item => item._id === singer._id);
        let updatedList;
        if (exists) {
            updatedList = likedSingers.filter(item => item._id !== singer._id);
        } else {
            updatedList = [...likedSingers, singer];
        }
        setLikedSingers(updatedList);
        localStorage.setItem("likedSingers", JSON.stringify(updatedList));
    };
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
                                    <i class="fa-regular fa-square-caret-right singer-itemImgi"></i>
                                </div>
                                <div className="singer-itemTitle">
                                    <span>{item.fullName}</span>
                                </div>
                            </Link>
                            <div
                                className={
                                    likedSingers.find(i => i._id === item._id)
                                        ? "singer-care-false singer-care"
                                        : "singer-care-true singer-care"
                                }
                                onClick={() => {
                                    const isLiked = likedSingers.find(i => i._id === item._id);
                                    toggleLike(item); // cập nhật danh sách
                                    setLikeMessage(isLiked ? "Bạn đã bỏ quan tâm" : "Bạn đã quan tâm");

                                    setTimeout(() => {
                                        setLikeMessage('');
                                    }, 3000);
                                }}
                            >

                                {likedSingers.find(i => i._id === item._id) ? "Bỏ Quan Tâm" : "Quan Tâm"}
                            </div>


                        </li>
                    ))
                ) : (
                    <li>Không có ca sỹ nào</li>
                )}
            </ul>

        </div >
    );
}
