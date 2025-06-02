import { useEffect, useState } from "react";
import { createTopic } from "../../../services/topic";
import "./mainSinger.css";

export default function MainSinger() {
    const [topic, setTopic] = useState([]);

    useEffect(() => {
        const fetchTopic = async () => {
            const result = await createTopic();
            setTopic(result.topic);
        };
        fetchTopic();
    }, []);
    // console.log(topic);

    return (
        <div className="mainSinger">
            <h2>Thể loại</h2>
            {topic.length > 0 ? (
                <ul>
                    {topic.map((item) => (
                        <li key={item._id} className="mainSinger-item">
                            <img className="mainSingerImg" src={item.avatar} alt={item.title} width={50} height={50} /> {/* Hiển thị avatar */}
                            <div className="mainSingerText">
                                <strong>{item.title}</strong>
                                <p>{item.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <h1>Lỗi da ta</h1>
            )}
        </div>
    );
}
