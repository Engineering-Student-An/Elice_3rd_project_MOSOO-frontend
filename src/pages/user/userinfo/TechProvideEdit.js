import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchCategory from '../../../components/SearchCategory';
import AddressModal from '../../../components/AddressModal';
import './TechProvide.css';

const TechProvideEdit = () => {
  const [techInfo, setTechInfo] = useState({
    userInfoId: "",
    gender: '',
    businessName: '',
    businessNumber: '',
    phoneNumber: '',
    gosuInfoAddress: '',
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [error, setError] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [userInfoId, setUserInfoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/gosu/${userInfoId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = response.data;
            setTechInfo({
              userInfoId: data.userInfoId,
              gender: data.gender,
              businessName: data.businessName,
              businessNumber: data.businessNumber,
              phoneNumber: data.gosuInfoPhone,
              gosuInfoAddress: data.gosuInfoAddress,
            });
            setSelectedAddress(data.gosuInfoAddress);
            setSelectedCategory({ categoryId: data.categoryId, name: data.categoryName });
          } catch (error) {
            console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
            setError('사용자 정보를 가져오는 데 오류가 발생했습니다.');
          }
        } else {
          setError('토큰이 존재하지 않습니다.');
        }
      };

      fetchUserData();
    }, [userInfoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechInfo({ ...techInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCategory || !selectedCategory.categoryId || !selectedAddress || !techInfo.gender || !techInfo.businessName || !techInfo.businessNumber) {
      setError('모든 필드를 채워주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/gosu`, {
        userInfoId: techInfo.userInfoId,
        gender: techInfo.gender,
        businessName: techInfo.businessName,
        businessNumber: techInfo.businessNumber,
        gosuInfoAddress: selectedAddress,
        gosuInfoPhone: techInfo.phoneNumber,
        categoryId: selectedCategory.categoryId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('기술 제공 정보가 성공적으로 수정되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('기술 제공 정보 수정 오류:', error);
      setError('기술 제공 정보 수정 중 오류가 발생했습니다.');
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

  return (
    <div className="tech-provide">
      <h2>기술 제공 정보 수정</h2>
      <form onSubmit={handleSubmit} className="tech-provide-form">
        {/* 성별 선택 */}
        <div className="form-group">
          <label htmlFor="gender">
            성별 *
            <select
              name="gender"
              value={techInfo.gender}
              onChange={handleChange}
              className="tech-provide-input"
              id="gender"
            >
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </label>
        </div>

        {/* 사업자명 입력 */}
        <div className="form-group">
          <label htmlFor="businessName">
            사업자명 *
            <input
              type="text"
              name="businessName"
              value={techInfo.businessName}
              onChange={handleChange}
              className="tech-provide-input"
              id="businessName"
            />
          </label>
        </div>

        {/* 사업자번호 입력 */}
        <div className="form-group">
          <label htmlFor="businessNumber">
            사업자번호 *
            <input
              type="text"
              name="businessNumber"
              value={techInfo.businessNumber}
              onChange={handleChange}
              className="tech-provide-input"
              id="businessNumber"
            />
          </label>
        </div>

        {/* 전화번호 입력 */}
        <div className="form-group">
          <label htmlFor="phoneNumber">
            전화번호 *
            <input
              type="text"
              name="phoneNumber"
              value={techInfo.phoneNumber}
              onChange={handleChange}
              className="tech-provide-input"
              placeholder="전화번호 입력"
            />
          </label>
        </div>

        <div className="tech-provide-row">
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

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <button type="submit" className="tech-provide-submit">수정 완료</button>
      </form>

      {showCategoryModal && <SearchCategory onClose={closeCategoryModal} onSelectCategory={handleSelectCategory} />}
      {showAddressModal && <AddressModal onClose={closeAddressModal} onSelectAddress={handleSelectAddress} />}
    </div>
  );
};

export default TechProvideEdit;
