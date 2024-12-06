import React from 'react';
import "./Search.css";

const Search = () => {
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
            />
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-12 p-0">
          <div className="search-input">
            <label htmlFor="category">
              <i className="lni lni-grid-alt theme-color"></i>
            </label>
            <select name="category" id="category">
              <option value="none" selected disabled>
                카테고리
              </option>
            </select>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-12 p-0">
          <div className="search-input">
            <label htmlFor="location">
              <i className="lni lni-map-marker theme-color"></i>
            </label>
            <select name="location" id="location">
              <option value="none" selected disabled>
                지역
              </option>
            </select>
          </div>
        </div>
        <div className="col-lg-2 col-md-2 col-12 p-0">
          <div className="search-btn button">
            <button className="btn">
              <i className="lni lni-search-alt"></i> 검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;