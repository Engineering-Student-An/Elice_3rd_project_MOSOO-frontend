import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SecondCategory.css";

const SecondCategoryModal = ({ category_id, onSelectSecondcategory }) => {
  const [secondcategories, setSecondcategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSecondcategory, setSelectedSecondcategory] = useState(null);

  useEffect(() => {
    const fetchSecondcategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/category/${category_id}`
        );
        setSecondcategories(response.data);
      } catch (error) {
        console.error("Error fetching secondcategories:", error);
        setError("세부 카테고리 데이터를 불러오는 데 문제가 발생했습니다.");
      }
    };

    if (category_id) {
      fetchSecondcategories();
    }
  }, [category_id]);

  const handleSecondcategorySelect = (secondcategory) => {
    setSelectedSecondcategory(secondcategory);
    if (onSelectSecondcategory) {
      onSelectSecondcategory(secondcategory);
    }
  };

  return (
    <div>
      <h4>중분류를 선택해주세요.</h4>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="secondcategory-list">
          {secondcategories.map((secondcategory, index) => (
            <div
              className="secondcategory-item"
              key={index}
              onClick={() => handleSecondcategorySelect(secondcategory)}
              style={{
                backgroundColor: selectedSecondcategory?.id === secondcategory.id ? "#dcdcdc" : "",
              }}
            >
              <p>{secondcategory.name}</p>
            </div>
          ))}
        </div>
      )}
      {selectedSecondcategory && (
        <div>
          <p>선택된 중분류: {selectedSecondcategory.name}</p>
        </div>
      )}
    </div>
  );
};

export default SecondCategoryModal;