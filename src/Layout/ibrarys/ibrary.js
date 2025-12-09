import { useEffect, useState } from "react";
import "./ibrary.css";
import { create, createSong } from "../../services/song";
import { createTopic } from "../../services/topic";
import Music from "../../pages/overviews/Music";
import Abum from "../../pages/abum/abum";
import Singer from "../../pages/singer/singer";
export default function Ibeary() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [song, setSong] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  const [currentId, setCurrentId] = useState(() => {
    return localStorage.getItem("currentId") || "";
  });
  const [likedSingers, setLikedSingers] = useState([]);

  const [topic, setTopic] = useState([]);
  const [likeAbums, setLikeAbums] = useState([]);

  const tabs = ["Bài hát", "Abum", "Playlist"];
  const tab = [`song`, `singer`, `topic`];
  const [post, setPost] = useState([]);
  const [type, setType] = useState(`song`);

  useEffect(() => {
    fetch(create(`${type}`))
      .then((res) => res.json())
      .then((post) => {
        setPost(post);
      });
  }, [type]);
  console.log("hi");
  console.log(post);

  const toggleLike = (singer) => {
    const exists = likedSingers.find((item) => item._id === singer._id);
    let updatedList;
    if (exists) {
      updatedList = likedSingers.filter((item) => item._id !== singer._id);
    } else {
      updatedList = [...likedSingers, singer];
    }
    setLikedSingers(updatedList);
    localStorage.setItem("likedSingers", JSON.stringify(updatedList));
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("likedSingers")) || [];
    setLikedSingers(data);
  }, []);

  const removeFromLikedSinger = (id) => {
    const updated = likedSingers.filter((item) => item._id !== id);
    setLikedSingers(updated);
    localStorage.setItem("likedSingers", JSON.stringify(updated));
  };
  useEffect(() => {
    const fetchAbum = async () => {
      const result = await createTopic();
      result.topic.sort((a, b) => b.like - a.like);
      data.sort((a, b) => b.like - a.like);
      setTopic(result.topic);
    };

    const fetchSong = async () => {
      const result = await createSong();
      result.song.sort((a, b) => b.like - a.like);
      data.sort((a, b) => b.like - a.like);
      setSong(result.song);
    };
    const data = JSON.parse(localStorage.getItem("likedSongs")) || [];
    const dataAbum = JSON.parse(localStorage.getItem("likeAbums")) || [];

    setLikedSongs(data);
    setLikeAbums(dataAbum);

    fetchAbum();
    fetchSong();
  }, []);
  const removeFromLiked = (id) => {
    const updatedSongs = likedSongs.filter((song) => song._id !== id);
    setLikedSongs(updatedSongs);
    localStorage.setItem("likedSongs", JSON.stringify(updatedSongs));
  };

  const removeFromAbum = (id) => {
    const updateAbums = likeAbums.filter((topic) => topic._id !== id);
    setLikeAbums(updateAbums);
    localStorage.setItem("likeAbums", JSON.stringify(updateAbums));
  };

  useEffect(() => {
    const handleSongChanged = () => {
      const id = localStorage.getItem("currentId");
      setCurrentId(id);
    };
    window.addEventListener("songChanged", handleSongChanged);
    // console.log(currentId);
    return () => {
      window.removeEventListener("songChanged", handleSongChanged);
    };
  }, []);
  return (
    <>
      <div className="ibearySinger-All">
        <h3 className="ibearySinger-h1">Ca sĩ bạn quan tâm</h3>
        <ul className="ibearySinger-All-ul">
          {likedSingers.length === 0 ? (
            <p>Chưa có ca sĩ nào được quan tâm.</p>
          ) : (
            likedSingers.map((singer) => (
              <li key={singer._id} className="ibearySinger">
                <Singer item={singer} />
              </li>
            ))
          )}
        </ul>
      </div>

      <h3 className="ibeary-h1">Abum</h3>
      <ul className="ibearyAbum">
        {likeAbums.length === 0 ? (
          <p>Abum yêu thích rỗng.</p>
        ) : (
          likeAbums.map((topic) => (
            <li
              key={topic._id}
              onClick={() => {
                localStorage.setItem(
                  "queuePlaylist",
                  JSON.stringify(likeAbums)
                );
                localStorage.setItem("currentId", topic._id);
                window.dispatchEvent(new Event("songChanged"));
              }}
              className="ibearyAbum-item"
            >
              <Abum item={topic} />
              <div className="ibearyAbum-info">
                <i
                  className="fa-solid fa-heart removeAbum-heart ibearyAbum-icon"
                  title="Bỏ yêu thích"
                  onClick={() => removeFromAbum(topic._id)}
                ></i>
              </div>
            </li>
          ))
        )}
      </ul>
      <h3 className="ibeary-h1">Playlist</h3>
      {tabs.map((item) => (
        <button
          key={item}
          style={
            tabs === item
              ? {
                  color: "#fff",
                  background: "#333",
                }
              : {}
          }
          onClick={() => setType(tab)}
        >
          {item}
        </button>
      ))}

      <ul>
        {post.map((post) => {
          <li key={post.id}>{post.title || post.fullName}</li>;
        })}
      </ul>

      <h3 className="ibeary-h1">Yêu thích</h3>
      <ul>
        {likedSongs.length === 0 ? (
          <p>Chưa có bài hát nào được yêu thích.</p>
        ) : (
          likedSongs.map((song) => (
            <li
              key={song._id}
              onClick={() => {
                localStorage.setItem(
                  "queuePlaylist",
                  JSON.stringify(likedSongs)
                );
                localStorage.setItem("currentId", song._id);
                window.dispatchEvent(new Event("songChanged"));
              }}
              className="ibeary"
            >
              <Music item={song} user={user} />
            </li>
          ))
        )}
      </ul>
    </>
  );
}
