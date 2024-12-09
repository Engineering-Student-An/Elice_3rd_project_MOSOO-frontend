import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FirstCategory.css";

const FirstCategory = ( {onSelectFirstcategory} ) => {
  const [firstCategories, setFirstCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchFirstcategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/category/firstCategory`
        );
        setFirstCategories(response.data);
      } catch (error) {
        console.error("Error fetching firstcategories:", error);
        setError("대분류 데이터를 불러오는 데 문제가 발생했습니다.");
      }
    };
  
    fetchFirstcategories();
  }, []);

  // 핸들러
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    onSelectFirstcategory(category);
  };

  return (
    <div className="firstcategories-container">
      <h2>대분류를 선택해주세요.</h2>
      <div className="firstcategories-grid">
        {firstCategories.map((category) => (
          <div
            key={category.id}
            className={`firstcategory-item ${
              selectedCategory?.id === category.id ? "selected" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <img src={category.icon} alt={category.name} className="firstcategory-icon" />
            <span>{category.name}</span>
          </div>
        ))}
      </div>
      {selectedCategory && (
        <div className="selected-category-info">
          <p>{selectedCategory.name}</p>
        </div>
      )}
    </div>
  );
};

export default FirstCategory;