import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostDetail, fetchBids, createBid, fetchReviews } from './Api';
import { Modal, Button, Carousel } from 'react-bootstrap';
import './StarRating.css'; // 별표 스타일 추가

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [bids, setBids] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bidPrice, setBidPrice] = useState(0);
    const [bidDate, setBidDate] = useState('');
    const navigate = useNavigate();

    const loadPostDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPostDetail(id);
            setPost(data);
            if (data.offer) {
                loadReviews(data.id);
            }
        } catch (err) {
            setError('게시글을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const loadBids = async () => {
        try {
            const data = await fetchBids(id);
            console.log(data);
            setBids(data);
        } catch (err) {
            console.error('입찰 데이터를 불러오는 데 실패했습니다.', err);
            setError('입찰 데이터를 불러오는 데 실패했습니다.');
        }
    };

    const loadReviews = async (postId) => {
        try {
            const reviewsData = await fetchReviews(postId);
            setReviews(reviewsData.sort((a, b) => b.id - a.id)); // 최신 순 정렬
        } catch (err) {
            console.error('리뷰 데이터를 불러오는 데 실패했습니다.', err);
            setError('리뷰 데이터를 불러오는 데 실패했습니다.');
        }
    };

    const handleCreateBid = async () => {
        try {
            if (!bidPrice || !bidDate) {
                alert('입찰 금액과 날짜를 입력해주세요.');
                return;
            }
            const requestDto = {
                price: bidPrice,
                date: new Date(bidDate).toISOString(),
            };
            await createBid(id, requestDto); // userId=1과 함께 요청 전송
            alert('입찰이 성공적으로 등록되었습니다.');
            setShowModal(false); // 모달 닫기
            loadBids(); // 입찰 데이터 새로고침
        } catch (err) {
            console.error('입찰 등록에 실패했습니다.', err);
            alert('입찰 등록에 실패했습니다.');
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="star-rating">
                {Array.from({ length: fullStars }).map((_, i) => (
                    <span key={`full-${i}`} className="star full-star">★</span>
                ))}
                {halfStar && <span className="star half-star">★</span>}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <span key={`empty-${i}`} className="star empty-star">★</span>
                ))}
            </div>
        );
    };

    useEffect(() => {
        loadPostDetail();
        loadBids();
    }, [id]);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!post) {
        return <p>{id} 게시글을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow" style={{ maxWidth: '100%', borderRadius: '15px' }}>
                        <div
                            className="card-header d-flex justify-content-between align-items-center purple-bg text-white">
                            <h2 className="card-title mb-0">{post.title}</h2>
                        </div>

                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    {post.imgUrls && post.imgUrls.length > 0 ? (
                                        <Carousel>
                                            {post.imgUrls.map((imgUrl, index) => (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        src={imgUrl}
                                                        alt={`Slide ${index}`}
                                                        className="d-block w-100 rounded"
                                                        style={{
                                                            objectFit: 'contain',
                                                            maxHeight: '350px',
                                                        }}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    ) : (
                                        <p>이미지가 없습니다.</p>
                                    )}
                                </div>
                                <div className="col-md-6 d-flex align-items-center">
                                    <ul className="list-group w-100">
                                        <li className="list-group-item">
                                            <strong>주소:</strong> <small>{post.address}</small>
                                        </li>
                                        <li className="list-group-item">
                                            <strong>가격:</strong> {post.price.toLocaleString()} 원
                                        </li>
                                        <li className="list-group-item">
                                            <strong>기간:</strong> {post.duration}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h5 className="mb-3">설명</h5>
                                <p className="card-text">{post.description}</p>
                            </div>

                            <div className="mt-4">
                                {!post.offer && (
                                    <Button variant="primary" onClick={() => setShowModal(true)}>
                                        입찰하기
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 입찰 모달 */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>입찰하기</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label className="form-label">입찰 금액 (원)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={bidPrice}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value > 0) setBidPrice(value);
                                    }}
                                    min="1" // HTML5 속성을 통해 양수만 허용
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">입찰 날짜</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={bidDate}
                                    onChange={(e) => setBidDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]} // 오늘 날짜 이후로 제한
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                닫기
                            </Button>
                            <Button variant="primary" onClick={handleCreateBid}>
                                입찰 등록
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* 입찰(BID) 데이터 섹션 */}
                    {!post.offer && (
                        <div className="card mt-4 mb-4 shadow">
                            <div className="card-header">
                                <h5>입찰 현황</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-column">
                                    {Array.isArray(bids) && bids.length > 0 ? ( // bids가 배열인지 확인
                                        bids.map((bid, index) => (
                                            <div
                                                key={index}
                                                className="d-flex justify-content-between align-items-start mb-3 p-3 border rounded"
                                            >
                                                <div className="d-flex flex-column w-75">
                                                    <div className="mb-2">
                                                        <strong>입찰자:</strong> {bid.fullName}
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong>입찰 금액:</strong> {bid.price.toLocaleString()} 원
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong>작업 시작 가능일:</strong> {new Date(bid.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>입찰 데이터가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 리뷰 데이터 섹션 */}
                    {post.offer && (
                        <div className="card mt-4 mb-4 shadow">
                            <div className="card-header">
                                <h5>리뷰</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-column">
                                    {reviews.length > 0 ? (
                                        reviews.map((review, index) => (
                                            <div
                                                key={index}
                                                className="d-flex flex-column mb-3 p-3 border rounded"
                                            >
                                                <p><strong>작성자:</strong> {review.fullName}</p>
                                                <div>{renderStars(review.rating)}</div>
                                                <p><strong>리뷰 내용:</strong> {review.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>리뷰가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PostDetail;
