import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getSystem, getInfo } from "../../services/system";
import { createSinger } from "../../services/singer";
import { createSong, createPostSong } from "../../services/song";
import { createTopic } from "../../services/topic";
import { _get, _post } from "../../utils/requist";
import "./Setting.css";

export default function Setting({ title }) {
  const [system, setSystem] = useState(null);
  const [info, setInfo] = useState(null);
  const [stats, setStats] = useState({
    songs: 0,
    singers: 0,
    topics: 0,
    users: null,
  });
  const [singers, setSingers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [message, setMessage] = useState("");
  const [newSong, setNewSong] = useState({
    title: "",
    description: "",
    lyrics: "",
    slug: "",
    singerId: "",
    topicId: "",
    audioFile: null,
    avatarFile: null,
    audioLink: "",
    avatarLink: "",
    like: 0,
    status: "active",
  });
  const [newSingerName, setNewSingerName] = useState("");
  const [newSingerAvatarFile, setNewSingerAvatarFile] = useState(null);
  const [newSingerAvatarLink, setNewSingerAvatarLink] = useState("");

  const [newTopicName, setNewTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [allSongs, setAllSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const sys = await getSystem();
      setSystem(sys);
      // get extra info if endpoint exists
      try {
        const infoRes = await getInfo();
        setInfo(infoRes);
      } catch (e) {
        setInfo(null);
      }

      const [singerData, songData, topicData] = await Promise.all([
        createSinger(),
        createSong(),
        createTopic(),
      ]);

      setSingers(Array.isArray(singerData.singer) ? singerData.singer : []);
      setTopics(Array.isArray(topicData.topic) ? topicData.topic : []);

      setAllSongs(Array.isArray(songData.song) ? songData.song : []);
      setCurrentPage(1);

      const usersCount = await (async () => {
        try {
          const res = await _get("/user");
          if (!res.ok) return null;
          const json = await res.json();
          // try to infer array
          if (Array.isArray(json)) return json.length;
          if (json.users && Array.isArray(json.users)) return json.users.length;
          return null;
        } catch (err) {
          return null;
        }
      })();

      setStats({
        songs: Array.isArray(songData.song) ? songData.song.length : 0,
        singers: Array.isArray(singerData.singer)
          ? singerData.singer.length
          : 0,
        topics: Array.isArray(topicData.topic) ? topicData.topic.length : 0,
        users: usersCount,
      });
    } catch (err) {
      console.error("Error fetching settings data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewSong((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNewSong((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allSongs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedSongs = allSongs.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      let payload = null;
      // If user requested to create a new singer/topic inline, create them first
      if (newSong.singerId === "new") {
        if (!newSingerName) {
          setMessage("Vui lòng nhập tên ca sĩ mới.");
          return;
        }
        const formS = new FormData();
        formS.append("fullName", newSingerName);
        if (newSingerAvatarFile) formS.append("avatar", newSingerAvatarFile);
        if (newSingerAvatarLink)
          formS.append("avatarLink", newSingerAvatarLink);
        try {
          const resS = await _post(`/singer/create`, formS);
          const jsonS = await resS.json();
          const createdId =
            jsonS?.singer?._id || jsonS?._id || jsonS?.data?._id;
          if (!createdId) {
            setMessage("Tạo ca sĩ mới không thành công.");
            return;
          }
          setNewSingerName("");
          setNewSingerAvatarFile(null);
          setNewSingerAvatarLink("");
          setNewSong((p) => ({ ...p, singerId: createdId }));
        } catch (err) {
          console.error(err);
          setMessage("Lỗi khi tạo ca sĩ mới.");
          return;
        }
      }

      if (newSong.topicId === "new") {
        if (!newTopicName) {
          setMessage("Vui lòng nhập tên chủ đề mới.");
          return;
        }
        try {
          const resT = await _post(`/topic/create`, { name: newTopicName });
          const jsonT = await resT.json();
          const createdTid =
            jsonT?.topic?._id || jsonT?._id || jsonT?.data?._id;
          if (!createdTid) {
            setMessage("Tạo chủ đề mới không thành công.");
            return;
          }
          setNewTopicName("");
          setNewSong((p) => ({ ...p, topicId: createdTid }));
        } catch (err) {
          console.error(err);
          setMessage("Lỗi khi tạo chủ đề mới.");
          return;
        }
      }
      const form = new FormData();
      // files: audio and avatar
      if (newSong.audioFile) form.append("audio", newSong.audioFile);
      if (newSong.avatarFile) form.append("avatar", newSong.avatarFile);

      // basic fields matching backend schema
      form.append("title", newSong.title || "");
      form.append("description", newSong.description || "");
      form.append("lyrics", newSong.lyrics || "");
      form.append("slug", newSong.slug || "");
      form.append("singerId", newSong.singerId || "");
      form.append("topicId", newSong.topicId || "");
      form.append("like", String(newSong.like || 0));
      form.append("status", newSong.status || "active");

      // links (if provided) — backend may prefer link fields
      if (newSong.audioLink) form.append("audio", newSong.audioLink);
      if (newSong.avatarLink) form.append("avatar", newSong.avatarLink);

      // If no files and no links, backend may expect at least some fields
      payload = form;

      const res = await createPostSong(payload);
      if (res && res.success) {
        setMessage("Tạo bài hát thành công.");
        setNewSong({
          title: "",
          description: "",
          lyrics: "",
          slug: "",
          singerId: "",
          topicId: "",
          audioFile: null,
          avatarFile: null,
          audioLink: "",
          avatarLink: "",
          like: 0,
          status: "active",
        });
        // reset new-creator fields
        setNewSingerName("");
        setNewSingerAvatarFile(null);
        setNewSingerAvatarLink("");
        setNewTopicName("");
        // refresh stats / lists
        await fetchAll();
      } else {
        setMessage(res?.message || "Không thể tạo bài hát.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Lỗi khi tạo bài hát.");
    }
  };

  return (
    <div className="setting-page">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div className="setting-header">
        <h2>Cài Đặt Hệ Thống</h2>
        <button className="btn-refresh" onClick={fetchAll}>
          Làm mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="setting-grid">
          <section className="setting-card info">
            <h3>Thông tin hệ thống</h3>
            {system ? (
              <ul>
                {Object.entries(system).map(([k, v]) => (
                  <li key={k}>
                    <strong>{k}:</strong>{" "}
                    {typeof v === "object" ? JSON.stringify(v) : String(v)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có dữ liệu hệ thống.</p>
            )}
            {info && (
              <div className="system-info-extra">
                <h4>Thông tin thêm</h4>
                <pre>{JSON.stringify(info, null, 2)}</pre>
              </div>
            )}
          </section>

          <section className="setting-card stats">
            <h3>Thống kê</h3>
            <ul>
              <li>
                <strong>Bài hát:</strong> {stats.songs}
              </li>
              <li>
                <strong>Ca sĩ:</strong> {stats.singers}
              </li>
              <li>
                <strong>Chủ đề:</strong> {stats.topics}
              </li>
              <li>
                <strong>Người dùng:</strong>{" "}
                {stats.users === null ? "Không truy cập" : stats.users}
              </li>
            </ul>
            <p className="note">
              Ghi chú: lượt lấy số liệu dựa trên API public; nếu không có quyền,
              một số chỉ số sẽ là "Không truy cập".
            </p>

            <div className="add-song">
              <h4>Thêm bài hát mới</h4>
              <form className="add-song-form" onSubmit={handleSubmit}>
                <label>
                  Tên bài hát (title)
                  <input
                    name="title"
                    value={newSong.title}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Mô tả
                  <textarea
                    name="description"
                    value={newSong.description}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Slug
                  <input
                    name="slug"
                    value={newSong.slug}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Lyrics
                  <textarea
                    name="lyrics"
                    value={newSong.lyrics}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Ca sĩ
                  <select
                    name="singerId"
                    value={newSong.singerId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Chọn ca sĩ --</option>
                    <option value="new">+ Thêm mới ca sĩ...</option>
                    {singers.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.fullName}
                      </option>
                    ))}
                  </select>
                </label>

                {newSong.singerId === "new" && (
                  <div className="inline-new-item">
                    <label>
                      Tên ca sĩ mới
                      <input
                        type="text"
                        value={newSingerName}
                        onChange={(e) => setNewSingerName(e.target.value)}
                      />
                    </label>
                    <label>
                      Ảnh ca sĩ (file)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setNewSingerAvatarFile(e.target.files[0])
                        }
                      />
                    </label>
                    <label>
                      Hoặc link ảnh ca sĩ
                      <input
                        type="text"
                        value={newSingerAvatarLink}
                        onChange={(e) => setNewSingerAvatarLink(e.target.value)}
                      />
                    </label>
                  </div>
                )}

                <label>
                  Chủ đề
                  <select
                    name="topicId"
                    value={newSong.topicId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="new">+ Thêm mới chủ đề...</option>
                    {topics.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name || t.title || t.slug}
                      </option>
                    ))}
                  </select>
                </label>

                {newSong.topicId === "new" && (
                  <div className="inline-new-item">
                    <label>
                      Tên chủ đề mới
                      <input
                        type="text"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                      />
                    </label>
                  </div>
                )}

                <label>
                  File audio (ưu tiên)
                  <input
                    type="file"
                    name="audioFile"
                    accept="audio/*"
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Hoặc link audio
                  <input
                    name="audioLink"
                    value={newSong.audioLink}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Ảnh bìa (file)
                  <input
                    type="file"
                    name="avatarFile"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Hoặc link ảnh
                  <input
                    name="avatarLink"
                    value={newSong.avatarLink}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Like (số)
                  <input
                    type="number"
                    name="like"
                    value={newSong.like}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Trạng thái
                  <select
                    name="status"
                    value={newSong.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </label>

                <div className="form-actions">
                  <button type="submit" className="btn-refresh">
                    Tạo
                  </button>
                </div>
                {message && <p className="form-message">{message}</p>}
              </form>
            </div>
          </section>

          {/* Song List with Pagination */}
          <section className="setting-card song-list-section">
            <h3>Danh sách bài hát ({allSongs.length})</h3>
            {allSongs.length > 0 ? (
              <>
                <table className="song-table">
                  <thead>
                    <tr>
                      <th>Tên bài hát</th>
                      <th>Ca sĩ</th>
                      <th>Like</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSongs.map((song) => {
                      const singer = singers.find(s => s._id === song.singerId);
                      return (
                        <tr key={song._id}>
                          <td>{song.title || song.name || "N/A"}</td>
                          <td>{singer?.fullName || "Không rõ"}</td>
                          <td>{song.like || 0}</td>
                          <td>{song.status || "active"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="pagination">
                    {currentPage > 1 && (
                      <button onClick={() => handlePageChange(1)}>«</button>
                    )}
                    {currentPage > 1 && (
                      <button onClick={() => handlePageChange(currentPage - 1)}>‹</button>
                    )}

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={pageNum === currentPage ? "active" : ""}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum}>...</span>;
                      }
                      return null;
                    })}

                    {currentPage < totalPages && (
                      <button onClick={() => handlePageChange(currentPage + 1)}>›</button>
                    )}
                    {currentPage < totalPages && (
                      <button onClick={() => handlePageChange(totalPages)}>»</button>
                    )}
                  </div>
                )}
                <p className="pagination-info">
                  Trang {currentPage} / {totalPages} (Hiển thị {paginatedSongs.length} / {allSongs.length})
                </p>
              </>
            ) : (
              <p>Không có bài hát nào.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

