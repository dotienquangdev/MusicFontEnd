import "./playlist.css";
import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRedo,
} from "react-icons/fa";

export default function Playlist() {
  const [lyrics, setLyrics] = useState([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0); // Index to track the current lyric

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(1);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const loadCurrentSong = () => {
      const playlist = JSON.parse(localStorage.getItem("queuePlaylist")) || [];
      const currentId = localStorage.getItem("currentId");
      const songPlaying = playlist.find((song) => song?._id === currentId);
      setCurrentSong(songPlaying || null);
    };

    loadCurrentSong();
    window.addEventListener("songChanged", loadCurrentSong);
    return () => {
      window.removeEventListener("songChanged", loadCurrentSong);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    // keep isPlaying in sync with actual audio element state
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      handleNextSong();
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    if (audio) {
      audio.volume = volume;
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSong, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Use the audio element state and play() promise to avoid mismatch
    if (audio.paused) {
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.catch((err) => {
          // Play prevented (autoplay policy) or other error
          console.warn("Audio play failed:", err);
        });
      }
      // rely on 'play' event to set isPlaying
    } else {
      audio.pause();
      // 'pause' event will set isPlaying
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleNextSong = () => {
    const playlist = JSON.parse(localStorage.getItem("queuePlaylist")) || [];
    const currentId = localStorage.getItem("currentId");
    if (!Array.isArray(playlist) || playlist.length === 0 || !currentId) return;

    const currentIndex = playlist.findIndex((song) => song?._id === currentId);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];

    if (nextSong && nextSong._id) {
      localStorage.setItem("currentId", nextSong._id);
      window.dispatchEvent(new Event("songChanged"));
    }
  };

  const handlePreviousSong = () => {
    const playlist = JSON.parse(localStorage.getItem("queuePlaylist")) || [];
    const currentId = localStorage.getItem("currentId");
    if (!Array.isArray(playlist) || playlist.length === 0 || !currentId) return;

    const currentIndex = playlist.findIndex((song) => song?._id === currentId);
    if (currentIndex === -1) return;

    const previousIndex =
      (currentIndex - 1 + playlist.length) % playlist.length;
    const previousSong = playlist[previousIndex];

    if (previousSong && previousSong._id) {
      localStorage.setItem("currentId", previousSong._id);
      window.dispatchEvent(new Event("songChanged"));
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (currentSong?.lyrics) {
      const parsedLyrics = parseLrc(currentSong.lyrics);
      setLyrics(parsedLyrics);
    }
  }, [currentSong]);

  useEffect(() => {
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const slider = document.querySelector('.progress input[type="range"]');
    if (slider) {
      slider.style.setProperty("--progress", `${progressPercent}%`);
    }
  }, [currentTime, duration]);

  // update volume slider CSS var for styled background
  useEffect(() => {
    const vol = document.querySelector('.volume-control input[type="range"]');
    if (vol) vol.style.setProperty("--vol", `${Math.round(volume * 100)}%`);
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // keyboard handler for play button (space / enter to toggle)
  const handlePlayKey = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      togglePlay();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioRef.current || lyrics.length === 0) return;
      const currentTime = audioRef.current.currentTime;

      const currentLineIndex = lyrics.findIndex((line, index) => {
        const nextLine = lyrics[index + 1];
        return (
          currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
        );
      });

      if (currentLineIndex !== -1 && currentLineIndex !== currentLyricIndex) {
        setCurrentLyricIndex(currentLineIndex);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [lyrics, currentLyricIndex]);

  const parseLrc = (rawLyrics) => {
    const lines = rawLyrics.split("\n");
    const lrcArray = [];

    lines.forEach((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.+)/);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseInt(match[2]);
        const ms = match[3] ? parseInt(match[3]) : 0;
        const time = min * 60 + sec + ms / 1000;
        const text = match[4].trim();
        lrcArray.push({ time, text });
      }
    });

    return lrcArray;
  };

  return (
    <>
      {currentSong && (
        <div className="playListIn">
          <div className="playListIn-left">
            <img src={currentSong.avatar} alt={currentSong.title} width="50" />
            <div>
              <span>{currentSong.title}</span>
              <br />
              <span>{currentSong.singerName}</span>
            </div>
            <span className="playListIn-left-icon">
              <i className="fa-solid fa-heart"></i>
              <i className="fa-solid fa-ellipsis ml-2"></i>
            </span>
          </div>

          <div className="audio-player">
            <audio
              ref={audioRef}
              src={currentSong.audio}
              onEnded={handleNextSong}
              autoPlay
            />

            <div className="controls">
              <FaRandom className="icon" />
              <FaStepBackward className="icon" onClick={handlePreviousSong} />
              <div
                className={isPlaying ? "play-button playing" : "play-button"}
                onClick={togglePlay}
                onKeyDown={handlePlayKey}
                role="button"
                tabIndex={0}
                aria-pressed={isPlaying}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </div>
              <div
                className={isPlaying ? "visualizer playing" : "visualizer"}
                aria-hidden
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
              <FaStepForward className="icon" onClick={handleNextSong} />
              <FaRedo className="icon run-again" onClick={handleReplay} />
            </div>

            <div className="progress">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="volume-control">
            <span>🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
            <span>🔊</span>
          </div>

          <div className="playListIn-right">
            {lyrics.length > 0 && (
              <div className="lyrics-container">
                {lyrics
                  .slice(currentLyricIndex - 1, currentLyricIndex + 2)
                  .map((line, index) => (
                    <div
                      key={index}
                      className={`lyric-line ${
                        index === 1
                          ? "current"
                          : index === 0
                          ? "previous"
                          : "next"
                      }`}
                    >
                      {line.text}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
