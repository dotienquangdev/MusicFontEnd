import "./singerDetail.css";
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

export default function SingerDetail({ title }) {
    const { id } = useParams();
    const [selectedSinger, setSelectedSinger] = useState(null);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const singerRes = await fetch('http://localhost:9000/api/singer');
                const singerData = await singerRes.json();

                console.log("id từ useParams:", id);
                console.log("Dữ liệu singer từ API:", singerData);

                const singerList = singerData.singer;
                if (!Array.isArray(singerList)) {
                    console.error("Dữ liệu không đúng định dạng:", singerList);
                    return;
                }

                const singer = singerList.find(item => item._id?.toString() === id?.toString());
                console.log("Danh sách ID:", singerList.map(s => s._id));
                console.log("Ca sĩ được chọn:", singer);

                setSelectedSinger(singer);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu: ", err);
            }
        };

        fetchAPI();
    }, [id]);

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Link to={`/`}>Quay lại</Link>

            {selectedSinger ? (
                <div className="singer-detail-item">
                    <h2>Họ tên: {selectedSinger.fullName}</h2>
                    <img src={selectedSinger.avatar} alt={selectedSinger.slug} />
                </div>
            ) : (
                <p>Đang tải thông tin ca sĩ hoặc không tìm thấy ca sĩ...</p>
            )}
        </>
    );
}
