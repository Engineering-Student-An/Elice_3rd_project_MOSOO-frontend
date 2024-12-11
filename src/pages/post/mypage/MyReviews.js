import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../PostList.css';
import { Link, useNavigate } from 'react-router-dom';
import {fetchMyReviews} from "./MyReviewsApi"; // Link 컴포넌트 import

const StarRating = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<span key={i} className="star">★</span>);
        } else if (i - 0.5 <= rating) {
            stars.push(<span key={i} className="half-star"></span>);
        } else {
            stars.push(<span key={i} className="empty-star">★</span>);
        }
    }

    return (
        <div className="star-rating">
            {stars}
        </div>
    );
};

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadReviews = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMyReviews();
            setReviews(data.reviews);
        } catch (err) {
            setError('데이터를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadReviews();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-start align-items-center mb-4">
                <h2 className="purple-text">내 리뷰 목록</h2>

            </div>

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="row">
                {reviews.length === 0 ? (
                    <p>내 리뷰 목록이 없습니다.</p> // posts가 비어 있을 때 출력
                ) : (
                reviews.map((review) => (
                    <div className="col-md-4 mb-3" key={review.id}>
                        <div className="card" style={{ fontSize: '0.9rem' }}>

                            <div className="card-header purple-bg text-white">
                                <Link to={`/posts/${review.postId}`} className="text-white text-decoration-none">
                                    {review.postTitle}
                                </Link>
                            </div>
                            <div className="card-body">
                                <StarRating rating={review.rating} />
                                <p>{review.content}</p>
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
};

export default MyReviews;
