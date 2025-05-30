import React, { useEffect, useState } from 'react';
import "./mainAbum.css";
import { Link } from 'react-router-dom';
import { createTopic } from '../../../services/topic';
export default function MainAbum() {
    const [topics, setTopics] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [likeAbum, setLikeAbum] = useState('');
    // useEffect(() => {
    //     fetch('http://localhost:9000/api/topic')
    //         .then(res => res.json())
    //         .then(data => {
    //             // console.log("Data from API:", data);
    //             if (data && Array.isArray(data.topic)) {
    //                 setTopics(data.topic); // sửa ở đây
    //             } else {
    //                 setTopics([]);
    //             }
    //         })
    //         .catch(err => {
    //             console.error("Lỗi fetch API:", err);
    //             setTopics([]);
    //         });
    // }, []);

    useEffect(() => {
        const fetchTopic = async () => {
            const result = await createTopic();
            setTopics(result.topic);
        };
        fetchTopic();
    }, []);

    const rotateLeft = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        const newArr = [...topics];
        const first = newArr.shift(); // lấy ảnh đầu
        newArr.push(first); // đưa ảnh đầu về cuối
        setTopics(newArr);

        setTimeout(() => setIsTransitioning(false), 1000); // Sau 1 giây mới cho phép chuyển ảnh tiếp
    };

    const rotateRight = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        const newArr = [...topics];
        const last = newArr.pop();
        newArr.unshift(last);
        setTopics(newArr);

        setTimeout(() => setIsTransitioning(false), 1000); // Sau 1 giây mới cho phép chuyển ảnh tiếp
    };


    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (!isTransitioning) {
    //             rotateRight(); // Tự chuyển ảnh sang phải
    //         }
    //     }, 10000); // 3 giây một lần

    //     return () => clearInterval(interval); // Dọn dẹp khi component unmount
    // }, [isTransitioning]); // Theo dõi trạng thái chuyển ảnh

    return (
        <div className="topic">
            <span>Abum</span>
            <ul>
                <i className="fa-solid fa-arrow-left icont-next" onClick={rotateLeft}></i>

                {topics.length > 0 ? (
                    topics.slice(0, 6).map((topic, key) => (
                        <li key={topic._id} className="topic-item">
                            <div className="topic-itemImg">
                                <Link to={`/topic/${topic._id}`} key={topic._id}>
                                    <img
                                        src={topic.avatar}
                                        alt={topic.title}
                                    />
                                </Link>
                                <span className="icont-Abum">
                                    <i className="fa-solid fa-heart icontAbum icontAbum-heart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const likeAbums = JSON.parse(localStorage.getItem('likeAbums')) || [];
                                            if (!likeAbums.some(item => item._id === topic._id)) {
                                                likeAbums.push(topic);
                                                localStorage.setItem('likeAbums', JSON.stringify(likeAbums));
                                                setLikeAbum('Đã thêm vào yêu thích!');
                                                setTimeout(() => setLikeAbum('', 3000));
                                            }
                                        }}
                                    ></i>
                                    <i className="fa-regular fa-square-caret-right icontAbum icontAbum-caret"></i>
                                    <i className="fa-solid fa-ellipsis icontAbum icontAbumellipsis"></i>
                                </span>
                            </div>
                            <div className="topic-itemTitle">
                                <span>{topic.title}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>Không có ca sỹ nào</li>
                )}
                <i className="fa-solid fa-arrow-right icont-next" onClick={rotateRight}></i>

            </ul>
        </div>
    );
}
