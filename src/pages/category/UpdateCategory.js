import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/button.css';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const UpdateCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { category_id } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const category = {
      name: name,
      description: description,
      parent_id: category_id
    };

    try {
      // 카테고리 수정 API 호출
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/category/${category_id}`,
        category,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      alert('카테고리가 수정되었습니다!');
      navigate('/categories');
    } catch (error) {
      console.error('카테고리 수정 실패:', error);
      alert('카테고리 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">카테고리 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">이름</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="카테고리 이름을 입력하세요"
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
            placeholder="카테고리 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="purple-button">
            수정
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

export default UpdateCategory;