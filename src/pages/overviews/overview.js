import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./overview.css"
import { loginUsers, loginUserDelete } from "../../services/user";
import { createSinger } from "../../services/singer";
import { createSong } from "../../services/song";
import { createTopic } from "../../services/topic";
import { deleteUser, deleteUserDelete } from "../../services/user";
import { deleteSong } from "../../services/song";

import { editSong } from "../../services/song";
import { editPatchSong } from "../../services/song";

import { message } from 'antd';
export default function Overview({ title }) {

    const [messageApi, contextHolder] = message.useMessage();

    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userLevel = user?.level || 1;
    console.log(user);


    const [overview, setOverview] = useState([]);
    const [overviewSong, setOverviewSong] = useState([]);
    const [overviewDelete, setOverviewDelete] = useState([]);

    const [song, setSong] = useState([]);
    const [singer, setSinger] = useState([]);
    const [topic, setTopic] = useState([]);

    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        title: "",
        position: 0
    });

    const handleEditClick = async (id) => {
        try {
            const result = await editSong(id);
            console.log("Kết quả từ editSong:", result);

            if (result && result.data) {
                setEditData({
                    title: result.data.title || "",
                    avatar: result.data.avatar || "",
                    description: result.data.description || "",
                    like: result.data.like || 0,
                    audio: result.data.audio || "",
                    lyrics: result.data.lyrics || "",
                    slug: result.data.slug || "",
                });
                setEditId(id);
            } else {
                alert("Không tìm thấy dữ liệu bài hát");
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu bài hát:", error);
            alert("Lỗi lấy dữ liệu bài hát");
        }
    };


    const handleUpdateSong = async () => {
        try {
            if (!editId || editId === "back") {
                alert("ID bài hát không hợp lệ.");
                return;
            }

            await editPatchSong(editId, editData);
            alert("Cập nhật thành công");
            setEditId(null); // đóng form
            const result = await createSong();
        } catch (error) {
            console.error("Lỗi cập nhật bài hát:", error);
            alert("Cập nhật thất bại");
        }
    };


    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            setOverview(prev => prev.filter(user => user._id !== id));
            alert("Xóa người dùng thành công.");
        } catch (error) {
            console.error("Xóa người dùng thất bại:", error);
            alert("Xóa người dùng thất bại.");
        }
    };
    const handleDeleteSong = async (id) => {
        try {
            await deleteSong(id);
            setOverviewSong(prev => prev.filter(song => song._id !== id));
            alert("Xóa bài hát thành công.");
        } catch (error) {
            console.error("Xóa bài hát thất bại:", error);
            alert("Xóa bài hát thất bại.");
        }
    };

    const handleDeleteAll = async (id) => {
        try {
            await deleteUserDelete(id);
            setOverviewDelete(prev => prev.filter(user => user._id !== id));
            alert("Khôi phục người dùng thành công.");

        } catch (error) {
            console.error("Khôi phục người dùng thất bại:", error);
            alert("Khôi phục người dùng thất bại.");
        }
    };

    useEffect(() => {
        const fetchOverview = async () => {
            const result = await loginUsers();
            setOverview(result.user); // tùy theo API trả về 
        };
        const fetchOverviewDelete = async () => {
            const result = await loginUserDelete();
            setOverviewDelete(result.user); // tùy theo API trả về 
        };


        const fetchSinger = async () => {
            const result = await createSinger();
            setSinger(result.singer);
        }

        const fetchSong = async () => {
            try {
                const result = await createSong();
                console.log("Kết quả từ createSong:", result);

                if (result && Array.isArray(result.song)) {
                    const validSongs = result.song.filter(
                        item => item && item.title && item.avatar
                    );
                    setSong(validSongs);
                } else {
                    setSong([]);
                    console.warn("Dữ liệu trả về không hợp lệ:", result);
                }
            } catch (err) {
                console.error("Lỗi khi fetch bài hát:", err);
                setSong([]);
            }
        };
        const fetchTopic = async () => {
            const result = await createTopic();
            setTopic(result.topic);
        }

        fetchTopic();
        fetchSinger();
        fetchSong();
        fetchOverview();
        fetchOverviewDelete();
    }, []);

    return (
        <> {contextHolder}
            <div className="overviewAll">
                <Helmet>
                    <title>{title}</title>
                </Helmet>

                <div className="overview-topic">
                    <p>Số lượng bài hát: {song.length}</p>
                    <p>Số lượng chủ đề: {topic.length}</p>
                    <p>Số lượng ca sỹ: {singer.length}</p>
                    <p>Số lượng tài khoản: {overview.length}</p>
                    <p>Số lượng tài khoản đã xóa: {overviewDelete.length}</p>
                </div>

                <div className="overviewSong">
                    <h2 className="overviewSong-text">Danh sách bài hát:  {song.length}</h2>
                    <ul className="overviewSong-item">
                        {song.length > 0 ? (
                            song.map(item => (
                                item && item.title && item.avatar ? (
                                    <li key={item._id} className="overviewSongItem-item">
                                        <img className="overviewSongItem-img" src={item.avatar} alt={item.title} />
                                        <span className="overviewSongItem-text">{item.title}</span>
                                        {userLevel === 3 && (
                                            <span className="overviewSongItem-button">
                                                <button onClick={() => handleEditClick(item._id)}>Sửa</button>
                                                <button onClick={() => handleDeleteSong(item._id)}>Xóa</button>
                                            </span>
                                        )}
                                    </li>
                                ) : null
                            ))
                        ) : (
                            <div>Không có dữ liệu</div>
                        )}
                    </ul>
                </div>

                {/* Modal sửa bài hát */}
                {editId && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Sửa bài hát</h3>

                            <label htmlFor="title">Tên bài hát</label>
                            <input
                                id="title"
                                type="text"
                                value={editData.title || ""}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                placeholder="Tên bài hát"
                            />

                            <label htmlFor="avatar">Avatar</label>
                            <input
                                id="avatar"
                                type="text"
                                value={editData.avatar || ""}
                                onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                                placeholder="Avatar"
                            />

                            <label htmlFor="description">Mô tả</label>
                            <input
                                id="description"
                                type="text"
                                value={editData.description || ""}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                placeholder="Mô tả"
                            />

                            <label htmlFor="like">Like</label>
                            <input
                                id="like"
                                type="number"
                                value={editData.like || 0}
                                onChange={(e) => setEditData({ ...editData, like: Number(e.target.value) })}
                                placeholder="Like"
                            />

                            <label htmlFor="audio">Audio</label>
                            <input
                                id="audio"
                                type="text"
                                value={editData.audio || ""}
                                onChange={(e) => setEditData({ ...editData, audio: e.target.value })}
                                placeholder="Audio"
                            />

                            <label htmlFor="lyrics">Lời bài hát</label>
                            <input
                                id="lyrics"
                                type="text"
                                value={editData.lyrics || ""}
                                onChange={(e) => setEditData({ ...editData, lyrics: e.target.value })}
                                placeholder="Lời bài hát"
                            />

                            <div className="modal-buttons">
                                <button onClick={handleUpdateSong}>Cập nhật</button>
                                <button onClick={() => setEditId(null)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}


                <div className="overview">
                    <h2 className="overviewh2">Danh sách tài khoản người dùng</h2>
                    <ul className="overviewText">
                        {overview.length > 0 ? (
                            overview.map(item => (
                                <li key={item._id} className="overview-item">
                                    <span>{item.fullName}</span>
                                    <span>{item.email}</span>
                                    {userLevel === 3 && (

                                        <span>
                                            <button>Sửa</button>
                                            <button onClick={() => handleDelete(item._id)}>Xóa</button>
                                        </span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <div>Không có dữ liệu</div>
                        )}
                    </ul>
                </div>

                <div className="overview">
                    <h2 className="overviewh2">Danh sách tài khoản người dùng đã xóa</h2>
                    <ul className="overviewText">
                        {overviewDelete.length > 0 ? (
                            overviewDelete.map(item => (
                                <li key={item._id} className="overview-item">
                                    <span>{item.fullName}</span>
                                    <span>{item.email}</span>
                                    {userLevel === 3 && (
                                        <span>
                                            <button onClick={() => handleDeleteAll(item._id)}>Khôi phục</button>
                                        </span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <div>Không có dữ liệu</div>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}
