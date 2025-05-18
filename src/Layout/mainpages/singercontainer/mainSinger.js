import { useEffect, useState } from "react";
import { createTopic } from "../../../services/topic";

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
        <>
            <h2>Thể loại</h2>
            {topic.length > 0 ? (
                <ul>
                    {topic.map((item) => (
                        <li key={item._id}> {/* Đảm bảo item._id là duy nhất */}
                            <img src={item.avatar} alt={item.title} width={50} height={50} /> {/* Hiển thị avatar */}
                            <div>
                                <strong>{item.title}</strong>
                                <p>{item.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <h1>Lỗi da ta</h1>
            )}
        </>
    );
}
