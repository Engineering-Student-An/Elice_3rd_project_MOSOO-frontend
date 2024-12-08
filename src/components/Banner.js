import React, { useState, useEffect } from 'react';
import './Banner.css';
import image1 from '../assets/images/banner/banner1.jpg';
import image2 from '../assets/images/banner/banner2.jpg';
import buttonImage1 from '../assets/images/banner/button/button1.png';
import buttonImage2 from '../assets/images/banner/button/button2.png';

function Banner() {
  const imageUrls = [image1, image2];
  const [currentIndex, setCurrentIndex] = useState(0);

  /* 배너 이미지 슬라이드 */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 20000);

    return () => clearInterval(interval);
  }, [currentIndex, imageUrls.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="banner-container">
      <div className="banner-left-image">
        <button className="banner-arrow banner-prev" onClick={handlePrev}>
          &lt;
        </button>
        <img src={imageUrls[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
        <button className="banner-arrow banner-next" onClick={handleNext}>
          &gt;
        </button>
      </div>
      <div className="banner-right-buttons">
        <div className="banner-button banner-top-button">
          <img src={buttonImage1} alt="버튼1 이미지" />
          <p className="banner-button-text">맞춤 주문 요청</p>
        </div>
        <div className="banner-button banner-bottom-button">
          <img src={buttonImage2} alt="버튼2 이미지" />
          <p className="banner-button-text">요청 글 목록</p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
