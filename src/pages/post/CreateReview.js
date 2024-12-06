import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateStarRating.css'; // 별표 스타일 추가

const CreateReview = () => {
    const { id } = useParams(); // 게시글 ID를 URL에서 가져옴
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0); // 마우스 오버 상태
    const [userId] = useState(1); // 사용자 ID, 실제 환경에서는 동적으로 설정해야 함
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content || rating < 1 || rating > 5) {
            alert('리뷰 내용을 작성하고 평점을 1에서 5 사이로 설정해주세요.');
            return;
        }

        const reviewData = {
            content,
            rating,
        };

        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/review/${id}`, reviewData, {
                params: { userId },
            });
            alert('리뷰가 성공적으로 등록되었습니다.');
            navigate(`/posts/${id}`); // 리뷰 작성 후 게시글 상세 페이지로 이동
        } catch (err) {
            console.error('리뷰 등록에 실패했습니다.', err);
            setError('리뷰 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return (
            <div className="create-star-rating">
                {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <span
                            key={starValue}
                            className={`create-star ${starValue <= (hoverRating || rating) ? 'selected' : ''}`}
                            onClick={() => setRating(starValue)} // 클릭 시 평점 설정
                            onMouseEnter={() => setHoverRating(starValue)} // 마우스 오버
                            onMouseLeave={() => setHoverRating(0)} // 마우스 아웃
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title mb-0">리뷰 작성</h3>
                        </div>
                        <div className="card-body">
                            {error && <p className="text-danger">{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">리뷰 내용</label>
                                    <textarea
                                        id="content"
                                        className="form-control"
                                        rows="4"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="리뷰 내용을 입력하세요."
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rating" className="form-label">평점</label>
                                    {renderStars()}
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? '등록 중...' : '리뷰 등록'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReview;
