import "./singerDetail.css";
import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createSinger } from "../../../../services/singer";
import { createSong } from "../../../../services/song";
import Music from "../../../../pages/overviews/Music";

export default function SingerDetail({ title }) {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [selectedSinger, setSelectedSinger] = useState(null);
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentId, setCurrentId] = useState(() => {
    return localStorage.getItem("currentId") || "";
  });
  useEffect(() => {
    const handleSongChanged = () => {
      const id = localStorage.getItem("currentId");
      setCurrentId(id);
    };
    window.addEventListener("songChanged", handleSongChanged);
    return () => {
      window.removeEventListener("songChanged", handleSongChanged);
    };
  }, []);
  useEffect(() => {
    const fetchDataSinger = async () => {
      try {
        const singerData = await createSinger();
        const songData = await createSong();

        const singerMap = new Map();

        singerData.singer.forEach((singer) => {
          singerMap.set(singer._id, singer.fullName);
        });
        const songsWithSinger = songData.song.map((song) => ({
          ...song,
          singerName: singerMap.get(song.singerId) || "Không rõ",
        }));
        setSongs(songsWithSinger);

        const filteredSongs = songData.song.filter(
          (song) => song.singerId === id
        );
        setRelatedSongs(filteredSongs);

        const singerList = singerData.singer;

        if (!Array.isArray(singerList)) {
          console.error("Dữ liệu không đúng định dạng:", singerList);
          return;
        }

        const singer = singerList.find(
          (item) => item._id?.toString() === id?.toString()
        );
        console.log(
          "Danh sách ID:",
          singerList.map((s) => s._id)
        );
        console.log("Ca sĩ được chọn:", singer);

        setSelectedSinger(singer);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataSinger();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Link to={`/`}>Quay lại</Link>

      <div className="singerDetailers">
        <SkeletonTheme baseColor="#372948" highlightColor="#6c5393">
          {loading ? (
            <>
              <div className="singerDetailAll-skeleton">
                <div className="singerDetailImg-Skeleton">
                  <Skeleton />
                </div>
                <div className="singerDetails-Skeleton">
                  {[...Array(4)].map((item, index) => (
                    <li className="singerDetail-Skeleton" key={index}>
                      <div className="singerDetail-Skeleton-item">
                        <Skeleton />
                      </div>
                      <div className="singerDetail-Skeleton-text">
                        <Skeleton />
                      </div>
                    </li>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {selectedSinger ? (
                <div className="singerDetailers-item">
                  <img src={selectedSinger.avatar} alt={selectedSinger.slug} />
                  <h3>{selectedSinger.fullName}</h3>
                </div>
              ) : (
                <p>Đang tải thông tin ca sĩ hoặc không tìm thấy ca sĩ...</p>
              )}

              <div className="singerDetaileSong">
                {relatedSongs.length > 0 ? (
                  <ul>
                    {relatedSongs.map((song) => (
                      <li
                        key={song._id}
                        className={`singerDetaileSong-item ${
                          currentId === song._id ? "active" : ""
                        }`}
                        onClick={() => {
                          localStorage.setItem(
                            "queuePlaylist",
                            JSON.stringify(relatedSongs)
                          );
                          localStorage.setItem("currentId", song._id);
                          window.dispatchEvent(new Event("songChanged"));
                        }}
                      >
                        <Link
                          className="singerDetaileSong-detail"
                          to={`/song/${song._id}`}
                        >
                          <Music item={song} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Chưa có bài hát nào cho chủ đề này.</p>
                )}
              </div>
            </>
          )}
        </SkeletonTheme>
      </div>
    </>
  );
}
