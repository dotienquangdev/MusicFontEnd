import React, { useEffect, useState } from 'react';
import "./mainAbum.css";
import { createTopic } from '../../../services/topic';
import Abum from '../../../pages/abum/abum';
export default function MainAbum() {
    const [topics, setTopics] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
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

    return (
        <div className="topic">
            <span>Abum</span>
            <ul>
                <i className="fa-solid fa-arrow-left icont-next" onClick={rotateLeft}></i>
                {topics.length > 0 ? (
                    topics.slice(0, 6).map((topic, key) => (
                        <li key={topic._id} className="topic-item">
                            <Abum item={topic} user={user} />
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
