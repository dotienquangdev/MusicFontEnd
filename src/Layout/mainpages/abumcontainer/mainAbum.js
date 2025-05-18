import React, { useEffect, useState } from 'react';
import "./mainAbum.css";
import { Link } from 'react-router-dom';
import { createTopic } from '../../../services/topic';
export default function MainAbum() {
    const [topics, setTopics] = useState([]);

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
    return (
        <div className="topic">
            <span>Abum</span>
            <ul>
                {topics.length > 0 ? (
                    topics.slice(0, 5).map(topic => (
                        <Link to={`/topic/${topic._id}`} key={topic._id}>
                            <li key={topic._id} className="topic-item">
                                <div className="topic-itemImg">
                                    <img
                                        src={topic.avatar}
                                        alt={topic.title}
                                    />
                                </div>
                                <div className="topic-itemTitle">
                                    <span>{topic.title}</span>
                                </div>
                            </li>
                        </Link>
                    ))
                ) : (
                    <li>Không có ca sỹ nào</li>
                )}
            </ul>
        </div>
    );
}
