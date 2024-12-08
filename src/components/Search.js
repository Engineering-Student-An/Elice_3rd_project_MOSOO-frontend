import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchCategory from './SearchCategory';
import AddressModal from './AddressModal';
import "./Search.css";

const Search = () => {
  // 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  // 핸들러
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("선택된 카테고리:", category);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    console.log("선택된 주소:", address);
  };

  // 검색
  const handleSearch = () => {
    console.log('검색 키워드:', keyword);
    console.log('선택된 카테고리:', selectedCategory);
    console.log('선택된 주소:', selectedAddress);
    
    navigate('/offerPosts', {
      state: {
        keyword,
        selectedCategory,
        selectedAddress
      }
    });
  };

  return (
    <div className="search-form wow fadeInUp" data-wow-delay=".7s">
      <h2>
        원하는 전문가를 검색해보세요.
      </h2>
      <div className="row">
        <div className="col-lg-4 col-md-4 col-12 p-0">
          <div className="search-input">
            <label htmlFor="keyword">
              <i className="lni lni-search-alt theme-color"></i>
            </label>
            <input
              type="text"
              name="keyword"
              id="keyword"
              placeholder="제품 키워드"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
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
        <div className="col-lg-2 col-md-2 col-12 p-0">
          <div className="search-btn button">
            <button className="btn" onClick={handleSearch}>
              <i className="lni lni-search-alt"></i> 검색
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <SearchCategory onClose={closeModal} onSelectCategory={handleCategorySelect} />}
      {isAddressModalOpen && <AddressModal onClose={closeAddressModal} onSelectAddress={handleSelectAddress} />}
    </div>
  );
};

export default Search;