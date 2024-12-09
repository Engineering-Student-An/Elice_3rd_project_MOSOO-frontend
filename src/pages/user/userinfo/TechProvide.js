import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchCategory from '../../../components/SearchCategory';
import AddressModal from '../../../components/AddressModal';
import './TechProvide.css';

const TechProvide = () => {
  const [techInfo, setTechInfo] = useState({
    gender: '',
    businessName: '',
    businessNumber: '',
    phoneNumber: '',
    verificationCode: '',
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [error, setError] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechInfo({ ...techInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCategory || !selectedCategory.category_id || !selectedAddress || !techInfo.gender || !techInfo.businessName || !techInfo.businessNumber) {
      setError('모든 필드를 채워주세요. 카테고리를 선택해야 합니다.');
      return;
    }

    if (!isVerified) {
      setError('전화번호 인증을 완료해야 합니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/tech-provide`, { ...techInfo, category: selectedCategory, address: selectedAddress }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('기술 제공 정보가 성공적으로 저장되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('기술 제공 정보 저장 오류:', error);
      setError('기술 제공 정보 저장 중 오류가 발생했습니다.');
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const openCategoryModal = () => {
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
  };

  const openAddressModal = () => {
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
  };

  const requestVerificationCode = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/request-verification-code`, {
        phoneNumber: techInfo.phoneNumber,
      });
      alert('인증 코드가 전송되었습니다.');
    } catch (error) {
      console.error('인증 코드 요청 오류:', error);
      setError('인증 코드 요청 중 오류가 발생했습니다.');
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/verify-code`, {
        phoneNumber: techInfo.phoneNumber,
        verificationCode: techInfo.verificationCode,
      });
      if (response.data.success) {
        setIsVerified(true);
        alert('전화번호 인증이 완료되었습니다.');
      } else {
        setError('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증 코드 확인 오류:', error);
      setError('인증 코드 확인 중 오류가 발생했습니다.');
    }
  };

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

        <label>
          전화번호 *
          <input
            type="text"
            name="phoneNumber"
            value={techInfo.phoneNumber}
            onChange={handleChange}
            className="tech-provide-input"
            placeholder="전화번호 입력"
          />
          <button type="button" onClick={requestVerificationCode} className="tech-provide-submit">인증 코드 요청</button>
        </label>

        <label>
          인증 코드 *
          <input
            type="text"
            name="verificationCode"
            value={techInfo.verificationCode}
            onChange={handleChange}
            className="tech-provide-input"
            placeholder="인증 코드 입력"
          />
          <button type="button" onClick={verifyCode} className="tech-provide-submit">확인</button> {/* 수정된 부분 */}
        </label>

        <div className="row">
          <div className="col-lg-3 col-md-3 col-12 p-0">
            <div className="search-input">
              <label htmlFor="category">
                <i className="lni lni-grid-alt theme-color"></i>
              </label>
              <button
                type="button"
                id="category"
                className="btn category-btn"
                onClick={openCategoryModal}
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
        </div>

        <p className="output-message">{error}</p>

        <button type="submit" className="tech-provide-submit">제출</button>
      </form>

      {showCategoryModal && <SearchCategory onClose={closeCategoryModal} onSelectCategory={handleSelectCategory} />}
      {showAddressModal && <AddressModal onClose={closeAddressModal} onSelectAddress={handleSelectAddress} />}
    </div>
  );
};

export default TechProvide;
