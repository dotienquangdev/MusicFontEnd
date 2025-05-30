import { useEffect, useState } from "react";
import { createPostSong, createSong } from "../../services/song";
import { message } from "antd";
import { createSinger } from "../../services/singer";
import { createTopic } from "../../services/topic";

const CreateMusic = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [showAddModal, setShowAddModal] = useState(false);
    const [singer, setSinger] = useState([]);
    const [topic, setTopic] = useState([]);
    const [newSongData, setNewSongData] = useState({
        title: "",
        avatar: "",
        description: "",
        like: 0,
        audio: "",
        lyrics: "",
        slug: "",
        singerId: "",
        topicId: "",
        status: "active",
        deleted: false
    });

    useEffect(() => {
        const fetchSinger = async () => {
            const result = await createSinger();
            setSinger(result.singer);
        }

        const fetchTopic = async () => {
            const result = await createTopic();
            setTopic(result.topic);
        }

        fetchTopic();
        fetchSinger()
    }, [])

    const handleAddSongSubmit = async () => {
        try {
            const result = await createPostSong(newSongData);
            console.log(result);
            if (result) {
                setShowAddModal(false);
                setNewSongData({
                    title: "",
                    avatar: "",
                    description: "",
                    like: 0,
                    audio: "",
                    lyrics: "",
                    singerId: "",
                    topicId: "",
                    slug: "",
                    status: "active",   // thêm nếu backend yêu cầu
                    deleted: false      // thêm nếu backend yêu cầu
                });
                const updatedSongs = await createSong();
                console.log(updatedSongs)
                messageApi.success("Thêm bài hát thành công!");
            } else {
                messageApi.error("Thêm bài hát thất bại!!");
            }
        } catch (error) {
            console.error("Lỗi thêm bài hát:", error);
            messageApi.error("Thêm bài hát thất bại!");
        }
    };
    return (
        <>
            {contextHolder}
            <button onClick={() => setShowAddModal(true)} style={{ margin: "3px" }}> + Thêm mới bài hát</button>
            {showAddModal && (
                <div className="modal-overlay" >
                    <div className="modal-content">
                        <h5>Thêm bài hát mới</h5>

                        <input
                            id="title"
                            type="text"
                            placeholder="Tên bài hát"
                            value={newSongData.title}
                            onChange={(e) => setNewSongData({ ...newSongData, title: e.target.value })}
                        />

                        <input
                            id="avatar"
                            placeholder="Avatar"
                            type="text"
                            value={newSongData.avatar}
                            onChange={(e) => setNewSongData({ ...newSongData, avatar: e.target.value })}
                        />

                        <input
                            id="description"
                            placeholder="Mô tả bài hát"
                            type="text"
                            value={newSongData.description}
                            onChange={(e) => setNewSongData({ ...newSongData, description: e.target.value })}
                        />

                        <select
                            id="singerId"
                            value={newSongData.singerId}
                            onChange={(e) => setNewSongData({ ...newSongData, singerId: e.target.value })}
                        >
                            <option value="">-- Chọn ca sĩ --</option>
                            {singer.map(s => (
                                <option key={s._id} value={s._id}>{s.fullName}</option>
                            ))}
                        </select>

                        <select
                            id="topicId"
                            value={newSongData.topicId}
                            onChange={(e) => setNewSongData({ ...newSongData, topicId: e.target.value })}
                        >
                            <option value="">-- Chọn chủ đề --</option>
                            {topic.map(t => (
                                <option key={t._id} value={t._id}>{t.title}</option>
                            ))}
                        </select>

                        <input
                            id="like"
                            placeholder="Like"
                            type="number"
                            value={newSongData.like}
                            onChange={(e) => setNewSongData({ ...newSongData, like: Number(e.target.value) })}
                        />

                        <input
                            id="audio"
                            placeholder="Audio"
                            type="text"
                            value={newSongData.audio}
                            onChange={(e) => setNewSongData({ ...newSongData, audio: e.target.value })}
                        />

                        {/* <label htmlFor="lyrics">Lời bài hát</label> */}
                        <input
                            id="lyrics"
                            placeholder="Lời bài hát"
                            type="text"
                            value={newSongData.lyrics}
                            onChange={(e) => setNewSongData({ ...newSongData, lyrics: e.target.value })}
                        />

                        <div className="modal-buttons">
                            <button onClick={handleAddSongSubmit}>Thêm mới</button>
                            <button onClick={() => setShowAddModal(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateMusic