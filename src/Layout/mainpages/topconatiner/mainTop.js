import "./mainTop.css";
import { useRef, useState } from "react";
import { useEffect } from "react";

export default function MainTop() {
    const imgContainerRef = useRef();

    const [topMusic, setTopMusic] = useState([
        {
            avatar: "http://res.cloudinary.com/dfjft1zvv/image/upload/v1723456820/images/gqdyjxgfu08marrkje0c.jpg",
            key: "66b9dd427b9711e0202eb794",
            name: "Mưa",
            otherSingersId: [
                {
                    _id: "66b9dccb7b9711e0202eb790",
                    fullName: "Thùy Chi",
                    slug: "thuy-chi-bcxYPFmwT7"
                }
            ],
            premium: true,
            singerId: {
                _id: "66b9db8f7b9711e0202eb78d",
                fullName: "Minh Vương M4U",
                slug: "minh-vuong-m4u-0C2nVbnb2L"
            },
            slug: "mua-s0L2She4MC",
        },
        {
            name: "Khuôn mặt đáng thương",
            slug: "khuon-mat-dang-thuong-7qwTsPsZ4a",
            avatar: "http://res.cloudinary.com/dfjft1zvv/image/upload/v1722306913/images/kiovfci3m1k5p6lufmto.jpg",
            singerId: {
                _id: "66a7b19f902aec43843e17da",
                fullName: "Sơn Tùng",
                slug: "son-tung-ysV2Kjyy5c"
            },
            otherSingersId: [],
            premium: false,
            key: "66a851651c36eabb8d0c84c2",
        },
        {
            avatar: "http://res.cloudinary.com/dfjft1zvv/image/upload/v1723456820/images/gqdyjxgfu08marrkje0c.jpg",
            key: "66b9dd427b9711e0202eb794",
            name: "Mưa",
            otherSingersId: [
                {
                    _id: "66b9dccb7b9711e0202eb790",
                    fullName: "Thùy Chi",
                    slug: "thuy-chi-bcxYPFmwT7"
                }
            ],
            premium: true,
            singerId: {
                _id: "66b9db8f7b9711e0202eb78d",
                fullName: "Minh Vương M4U",
                slug: "minh-vuong-m4u-0C2nVbnb2L"
            },
            slug: "mua-s0L2She4MC",
        },
        {
            name: "Cuối cùng thì",
            slug: "cuoi-cung-thi-VUxdaACM93",
            avatar: "http://res.cloudinary.com/dfjft1zvv/image/upload/v1722307772/images/l5f0h4i9kpeyqeu9ruqy.jpg",
            singerId: {
                _id: "66a7b36ea5474ad07687bf99",
                fullName: "Jack",
                slug: "jack-3NxWwofiVc"
            },
            otherSingersId: [],
            premium: false,
            key: "66a854bf923418ff968042a3",
        }
    ]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const rotateLeft = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        const newArr = [...topMusic];
        const first = newArr.shift(); // lấy ảnh đầu
        newArr.push(first); // đưa ảnh đầu về cuối
        setTopMusic(newArr);

        setTimeout(() => setIsTransitioning(false), 1000); // Sau 1 giây mới cho phép chuyển ảnh tiếp
    };

    const rotateRight = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        const newArr = [...topMusic];
        const last = newArr.pop();
        newArr.unshift(last);
        setTopMusic(newArr);

        setTimeout(() => setIsTransitioning(false), 1000); // Sau 1 giây mới cho phép chuyển ảnh tiếp
    };


    useEffect(() => {
        const interval = setInterval(() => {
            if (!isTransitioning) {
                rotateRight(); // Tự chuyển ảnh sang phải
            }
        }, 10000); // 3 giây một lần

        return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }, [isTransitioning]); // Theo dõi trạng thái chuyển ảnh


    return (
        <div className="mainTop">
            <i className="fa-solid fa-arrow-left" onClick={rotateLeft}></i>
            <div className="mainTop-img-wrapper" ref={imgContainerRef}>
                {topMusic.map((value, key) => (
                    <div className="mainTop-img" key={key}>
                        <img src={value.avatar} alt="" />
                    </div>
                ))}
            </div>
            <i className="fa-solid fa-arrow-right" onClick={rotateRight}></i>
        </div>
    );
}
