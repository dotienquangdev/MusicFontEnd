import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./header.css";

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [songResults, setSongResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResult, setNoResult] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [user, setUser] = useState(null); // Lưu thông tin người dùng
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái menu người dùng

    // Hàm loại bỏ dấu tiếng Việt
    function removeVietnameseTones(str) {
        return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }

    // Hàm xử lý thay đổi trong ô tìm kiếm
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            if (query.length >= 2) {
                fetchSongs(query);
            } else {
                setSongResults([]);
                setNoResult(false);
            }
        }, 300);

        setDebounceTimeout(timeout);
    };

    // Hàm gọi API và lọc kết quả
    const fetchSongs = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:9000/api/song`);
            const data = await response.json();
            const songs = data.song || [];

            const keywords = removeVietnameseTones(query.toLowerCase()).split(/\s+/);

            const filteredSongs = songs.filter(song => {
                const title = removeVietnameseTones(song.title?.toLowerCase() || "");
                const slug = song.slug?.toLowerCase() || "";
                return keywords.some(word =>
                    title.includes(word) || slug.includes(word)
                );
            });

            setSongResults(filteredSongs);
            setNoResult(filteredSongs.length === 0);
        } catch (error) {
            console.error("Error fetching songs:", error);
            setSongResults([]);
            setNoResult(true);
        } finally {
            setLoading(false);
        }
    };

    // Kiểm tra người dùng đăng nhập từ localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUser(userData); // Lưu thông tin người dùng vào state
        }
    }, []);

    // Hàm toggle mở/đóng menu người dùng
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Hàm đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
        setUser(null); // Cập nhật lại state user là null
        setIsMenuOpen(false); // Đóng menu
    };

    return (
        <div className="headers">
            <div className="header-search form-control" id="form-search">
                <input
                    type="text"
                    className="form-search form-control z-input-placeholder"
                    placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {(loading || songResults.length > 0 || noResult) && (
                <div className="search-results">
                    {loading && <p>Đang tìm kiếm...</p>}

                    {!loading && songResults.length > 0 && (
                        <ul>
                            {songResults.map((song) => (
                                <li key={song._id}>
                                    <a href={`/song/${song._id}`}>
                                        <img src={song.avatar} alt={song.title} />
                                        <span>{song.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!loading && noResult && (
                        <p>Không tìm thấy bài hát nào.</p>
                    )}
                </div>
            )}

            <div className="header-user">
                <div className="headerUser-setting">
                    <i className="fa-solid fa-gear"></i>
                </div>
                <div className="headerUser-id" onClick={toggleMenu}>
                    <span>
                        {user ? user.fullName : "Tài khoản"}
                    </span>
                </div>

                {/* Hiển thị menu người dùng nếu isMenuOpen là true */}
                {isMenuOpen && (
                    <div className="user-menu">
                        {user ? (
                            <>
                                <p>Tài khoản: {user.fullName}</p>
                                <button onClick={handleLogout}>Đăng xuất</button>
                            </>
                        ) : (
                            <>
                                <p>Tài khoản: Chưa đăng nhập</p>
                                <Link to="/userLogin">
                                    <button>Đăng nhập</button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
