import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Banner.css";
import image1 from "../assets/images/banner/siteimage.png";
import image2 from "../assets/images/banner/siteImage2.png";
import image3 from "../assets/images/banner/siteImage3.png";
import image4 from "../assets/images/banner/siteImage4.png";

import buttonImage1 from "../assets/images/banner/button/button1.png";
import buttonImage2 from "../assets/images/banner/button/button2.png";
import SearchRequestPostsModal from "./SearchRequestPosts";

function Banner() {
  const imageUrls = [image1, image2, image3, image4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  /* 배너 이미지 슬라이드 자동 전환 */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // 4초마다 슬라이드 전환

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, [imageUrls.length]);

  const navigateToCreatePost = () => {
    navigate("/createPost");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="banner-container">
      <div className="banner-left-image">
        <img
          src={imageUrls[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="banner-image"
        />
      </div>
      <div className="banner-right-buttons">
        <div
          className="banner-button banner-top-button"
          onClick={navigateToCreatePost}
        >
          <img src={buttonImage1} alt="버튼1 이미지" />
          <p className="banner-button-text">맞춤 주문 요청</p>
        </div>
        <div
          className="banner-button banner-bottom-button"
          onClick={toggleModal}
        >
          <img src={buttonImage2} alt="버튼2 이미지" />
          <p className="banner-button-text">요청 글 목록</p>
        </div>
      </div>

      {isModalOpen && <SearchRequestPostsModal onClose={toggleModal} />}
    </div>
  );
}

export default Banner;

