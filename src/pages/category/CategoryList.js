import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/CategoryList.css";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./components/DeleteModal";

const CategoryList = () => {
  // 카테고리 데이터 상태 관리
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    // 대분류 조회 API 호출
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/category`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategories();
  }, []);

  const navigate = useNavigate();

  // 이벤트 핸들러
  const handleCreate = (category_id) => {
    console.log("생성 버튼 클릭");
    navigate(`/categories/createsub/${category_id}`)
  };

  const handleCreateFirst = () => {
    console.log("대분류 생성 버튼 클릭");
    navigate('/categories/createfirst');
  };

  const handleUpdate = (category_id) => {
    console.log("수정 버튼 클릭");
    navigate(`/categories/update/${category_id}`);
  };

  const handleDelete = (category_id) => {
    setSelectedCategoryId(category_id);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/category/${selectedCategoryId}`
      );
      alert("카테고리가 삭제되었습니다.");
      setCategories(
        categories.filter(
          (category) => category.category_id !== selectedCategoryId
        )
      );
    } catch (error) {
      console.error("카테고리 삭제 실패:", error);
      alert("카테고리 삭제 중 오류가 발생했습니다.");
    } finally {
      setShowModal(false);
    }
  };

  // 토글 카테고리
  const toggleCategory = (category_id) => {
    setExpandedCategories((prevState) =>
      prevState.includes(category_id)
        ? prevState.filter((id) => id !== category_id)
        : [...prevState, category_id]
    );
  };

  // 재귀 카테고리 렌더링
  const renderCategories = (categories, level = 1) => {
    return categories.map((category) => (
      <div key={category.category_id} className={`category-item level-${level}`}>
        <div className="category-header" onClick={() => toggleCategory(category.category_id)}>
          {level === 1 && (
            <img src={category.icon} alt={category.name} className="category-icon" />
          )}
          <div className="category-name">
            {category.name}
          </div>
        </div>
        {level === 3 && category.description && (
          <div className="category-description">
            {category.description}
          </div>
        )}
        <div className="category-actions">
          {category.level < 3 && (
            <button
              className="btn-create"
              onClick={(e) => {
                e.stopPropagation();
                handleCreate(category.category_id);
              }}
            >
              생성
            </button>
          )}
          <button
            className="btn-update"
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate(category.category_id);
            }}
          >
            수정
          </button>
          <button
            className="btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(category.category_id);
            }}
          >
            삭제
          </button>
        </div>
        {expandedCategories.includes(category.category_id) &&
          category.children && category.children.length > 0 && (
            <div className="subcategory-list">
              {renderCategories(category.children, level + 1)}
            </div>
          )}
      </div>
    ));
  };
  
  return (
    <div className="container">
      <div className="category-header">
        <h1>카테고리 관리</h1>
        <button className="btn-create" onClick={handleCreateFirst}>
          대분류 생성
        </button>
      </div>
      <div className="category-list">
        {categories.length > 0 ? (
          renderCategories(categories)
        ) : (
          <p>카테고리를 불러오는 중입니다...</p>
        )}
      </div>

    {/* 삭제 모달 */}
      <DeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirm}
        title="카테고리 삭제"
        message="선택한 카테고리를 삭제하시겠습니까? 삭제한 카테고리는 복구할 수 없습니다."
      />
    </div>

    
  );
};

export default CategoryList;