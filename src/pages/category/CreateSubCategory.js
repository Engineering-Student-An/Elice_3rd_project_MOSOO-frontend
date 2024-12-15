import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/button.css';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const CreateSubCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { categoryId } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const category = {
      name: name,
      description: description,
      parentId: categoryId
    };

    // FormData 생성
    const formData = new FormData();
    formData.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }));

    try {
      // 서브카테고리 생성 API 호출
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/category`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      alert('하위 카테고리가 생성되었습니다!');
      navigate('/mypage', { state: { activeMenu: 'categoryManagement' } })
    } catch (error) {
      console.error('하위 카테고리 생성 실패:', error);
      alert('하위 카테고리 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">하위 카테고리 생성</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">이름</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="하위 카테고리 이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">설명</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            placeholder="하위 카테고리 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="purple-button">
            생성
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginLeft: '10px' }}
            onClick={() => window.history.back()}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubCategory;
