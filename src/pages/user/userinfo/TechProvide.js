import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchCategory from '../../../components/SearchCategory'; // 경로에 맞게 임포트
import AddressModal from '../../../components/AddressModal'; // AddressModal 임포트
import './TechProvide.css'; // 스타일 파일 임포트

const TechProvide = () => {
  const [techInfo, setTechInfo] = useState({
    gender: '', // 성별 추가
    businessName: '', // 사업자명 추가
    businessNumber: '', // 사업자번호 추가
  });
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태
  const [selectedAddress, setSelectedAddress] = useState('');
  const [error, setError] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false); // 카테고리 선택 모달 상태
  const [showAddressModal, setShowAddressModal] = useState(false); // 주소 선택 모달 상태
  const navigate = useNavigate();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechInfo({ ...techInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!selectedCategory || !setSelectedAddress || !techInfo.gender || !techInfo.businessName || !techInfo.businessNumber) {
      setError('모든 필드를 채워주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/tech-provide`, { ...techInfo, category: selectedCategory, setSelectedAddress }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('기술 제공 정보가 성공적으로 저장되었습니다.');
      navigate('/mypage'); // MyPage로 리다이렉트
    } catch (error) {
      console.error('기술 제공 정보 저장 오류:', error);
      setError('기술 제공 정보 저장 중 오류가 발생했습니다.');
    }
  };

const handleSelectCategory = (thirdCategory) => {
    setSelectedCategory(thirdCategory); // 선택된 카테고리 상태 업데이트
    setShowCategoryModal(false); // 카테고리 모달 닫기
};

const handleSelectAddress = (setSelectedAddress) => {
    selectedAddress(setSelectedAddress); // 선택된 주소 상태 업데이트
    setShowAddressModal(false); // 주소 모달 닫기
};

const openAddressModal = () => {
  setIsAddressModalOpen(true);
};

const closeAddressModal = () => {
  setIsAddressModalOpen(false);
};

const openModal = () => {
    setIsModalOpen(true);
};

const closeModal = () => {
    setIsModalOpen(false);
};

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="tech-provide">
      <h2>기술 제공 정보 입력</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="tech-provide-form">
        <label>
          성별 *
          <select
            name="gender"
            value={techInfo.gender}
            onChange={handleChange}
            className="tech-provide-input"
          >
            <option value="">선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
            <option value="other">기타</option>
          </select>
        </label>

        <label>
          사업자명 *
          <input
            type="text"
            name="businessName"
            value={techInfo.businessName}
            onChange={handleChange}
            className="tech-provide-input"
          />
        </label>

        <label>
          사업자번호 *
          <input
            type="text"
            name="businessNumber"
            value={techInfo.businessNumber}
            onChange={handleChange}
            className="tech-provide-input"
          />
        </label>

        <div className="col-lg-3 col-md-3 col-12 p-0">
                  <div className="search-input">
                    <label htmlFor="category">
                      <i className="lni lni-grid-alt theme-color"></i>
                    </label>
                    <button
                      type="button"
                      id="category"
                      className="btn category-btn"
                      onClick={openModal}
                    >
                      {selectedCategory ? selectedCategory.name : '카테고리 선택'}
                    </button>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-12 p-0">
                  <div className="search-input">
                    <label htmlFor="location">
                      <i className="lni lni-map-marker theme-color"></i>
                    </label>
                    <button
                      type="button"
                      id="location"
                      className="btn location-btn"
                      onClick={openAddressModal}
                    >
                      {selectedAddress || '지역 선택'}
                    </button>
                  </div>
                </div>

        <button type="submit" className="tech-provide-submit">제출</button>
      </form>
    </div>
  );
};

export default TechProvide;
