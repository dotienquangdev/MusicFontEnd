import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./overview.css"
import { loginUsers, loginUserDelete, deleteUser, deleteUserDelete } from "../../services/user";
import { createSong } from "../../services/song";
import { editPatchSong } from "../../services/song";
import { message } from 'antd';
import Music from "./Music";
import CreateMusic from "./CreateMusic";
export default function Overview({ title }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const userLevel = user?.level || 1;
    const [overview, setOverview] = useState([]);
    const [overviewDelete, setOverviewDelete] = useState([]);
    const [song, setSong] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        title: ""
    });
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
            setSong(result.song || []);
            console.log("Caap nhaat: ", result);
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
    }
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
        fetchSong();
        fetchOverview();
        fetchOverviewDelete();
    }, []);

    return (
        <>
            <div className="overviewAll">
                <Helmet>
                    <title>{title}</title>
                </Helmet>

                <div className="overviewSong">
                    <h2 className="overviewSong-text">Danh sách bài hát: <span style={{ color: "red" }}> {song.length} </span></h2>
                    <CreateMusic />
                    <ul className="overviewSong-item">
                        {song.length > 0 ? (
                            song.map(item => (
                                item && item.title && item.avatar ? (
                                    <li key={item._id} className="overviewSongItem-item">
                                        <Music item={item} user={user} />
                                    </li>
                                ) : null
                            ))
                        ) : (
                            <div>Không có dữ liệu</div>
                        )}
                    </ul>
                </div>

                {editId && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h5>Sửa bài hát</h5>

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
                                            <button style={{ margin: "1px" }} onClick={() => handleDeleteAll(item._id)}>Khôi phục</button>
                                            <button style={{ margin: "1px" }} onClick={() => { }}>Xóa VV</button>
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
