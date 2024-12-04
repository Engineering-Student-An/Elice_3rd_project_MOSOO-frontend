import React, { useState, useEffect } from "react";
import axios from "axios";
import StepModal from "./StepModal";
import "./MainCategory.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/category/first_category`,
          { withCredentials: true }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategories();
  }, []);

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="main-category-container">
      <h2>어떤 분야의 전문가를 찾으시나요?</h2>
      <div className="main-category-grid">
        {categories.map((category) => (
          <div
            className="main-category-item"
            key={category.id}
            onClick={() => openModal(category)}
          >
            <div className="main-category-icon">
              <img
                src={category.icon}
                alt={`${category.name} 아이콘`}
                className="main-category-icon-image"
              />
            </div>
            <div className="main-category-name">{category.name}</div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <StepModal
          categoryName={selectedCategory.name}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Category;
