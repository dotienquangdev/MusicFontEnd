import { useState } from "react";
import "./abum.css";
import { Link } from 'react-router-dom';
export default function Abum({ item }) {
    const [likeAbum, setLikeAbum] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            {likeAbum && (
                <div className="like-toast">{likeAbum}</div>
            )}
            <div className="abum">
                <ul>
                    <li key={item._id} className="abum-item">
                        <div className="abum-itemImg">
                            <Link to={`/topic/${item._id}`} key={item._id}>
                                <img
                                    className="abumImg"
                                    src={item.avatar}
                                    alt={item.title}
                                />
                            </Link>
                            <span className="icont-Abum">
                                <i className="fa-solid fa-heart icontAbum icontAbum-heart"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const likeAbums = JSON.parse(localStorage.getItem('likeAbums')) || [];
                                        const index = likeAbums.findIndex(singer => singer._id === item._id);
                                        if (index === -1) {
                                            likeAbums.push(item);
                                            localStorage.setItem('likeAbums', JSON.stringify(likeAbums));
                                            setLikeAbum('💖 Đã thêm vào yêu thích!');
                                        } else {
                                            likeAbums.splice(index, 1);
                                            localStorage.setItem('likeAbums', JSON.stringify(likeAbums));
                                            setLikeAbum('💔 Đã xóa khỏi yêu thích!');
                                        }
                                        setTimeout(() => setLikeAbum(''), 3000);
                                    }}
                                ></i>
                                <i className="fa-regular fa-square-caret-right icontAbum icontAbum-caret"></i>
                                <i className="fa-solid fa-ellipsis icontAbum icontAbumellipsis"></i>
                            </span>
                        </div>
                        <div className="abum-itemTitle">
                            <span>{item.title}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
}
