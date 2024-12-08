import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ThirdCategory.css";

const ThirdCategory = ({ selectedSubcategory, onSelectThirdCategory }) => {
  const [thirdcategories, setThirdcategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedThirdcategory, setSelectedThirdcategory] = useState(null);

  useEffect(() => {
    const fetchThirdcategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/category/${selectedSubcategory.category_id}`
        );
        setThirdcategories(response.data);
      } catch (error) {
        console.error("Error fetching thirdcategories:", error);
        setError("세부 카테고리 데이터를 불러오는 데 문제가 발생했습니다.");
      }
    };

    if (selectedSubcategory) {
      fetchThirdcategories();
    }
  }, [selectedSubcategory]);

  const handleThirdcategorySelect = (thirdcategory) => {
    setSelectedThirdcategory(thirdcategory);
    onSelectThirdCategory(thirdcategory);
  };

  return (
    <div>
      <h4>소분류를 선택해주세요.</h4>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="thirdcategory-list">
          {thirdcategories.map((thirdcategory, index) => (
            <div
              className="thirdcategory-item"
              key={index}
              onClick={() => handleThirdcategorySelect(thirdcategory)}
              style={{
                backgroundColor: selectedThirdcategory?.id === thirdcategory.id ? "#dcdcdc" : "",
              }}
            >
              <p>{thirdcategory.name}</p>
            </div>
          ))}
        </div>
      )}
      {selectedThirdcategory && (
        <div>
          <p>{selectedThirdcategory.name}</p>
        </div>
      )}
    </div>
  );
};

export default ThirdCategory;