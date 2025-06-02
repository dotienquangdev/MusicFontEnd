import { useState } from "react";
import "./singer.css";
import { Link } from 'react-router-dom';
export default function Singer({ item, user }) {

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
    return (
        <div className="abum">
            <ul>
                <li key={item._id} className="abum-item">
                    <Link to={`/singer/${item._id}`}>
                        <div className="singer-itemImg">
                            <img
                                src={item.avatar}
                                alt={item.fullName}
                            />
                            <i className="fa-regular fa-square-caret-right singer-itemImgi"></i>
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
                        onClick={(e) => {
                            e.stopPropagation();
                            const likeAbums = JSON.parse(localStorage.getItem('likeAbums')) || [];
                            const isLiked = likedSingers.find(i => i._id === item._id);
                            const index = likeAbums.find(i => i._id === item._id);
                            toggleLike(item);
                            setLikeMessage(isLiked ? "Bạn đã bỏ quan tâm" : "Bạn đã quan tâm");
                            setLikeMessage(index ? "Bạn đã bỏ quan tâm" : "Bạn đã quan tâm");
                            setTimeout(() => setLikeMessage(''), 3000);
                        }}
                    >
                        {likedSingers.find(i => i._id === item._id) ? "Bỏ Quan Tâm" : "Quan Tâm"}
                    </div>
                </li>
            </ul>
        </div>
    );
}
