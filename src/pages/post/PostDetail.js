import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostDetail, deletePost, fetchBids, createBid } from './Api';
import { Modal, Button } from 'react-bootstrap';

const PostDetail = () => {
    const { id } = useParams(); // URL에서 게시글 ID 추출
    const [post, setPost] = useState(null); // 게시글 데이터 상태
    const [bids, setBids] = useState([]); // 입찰 데이터 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태
    const [bidPrice, setBidPrice] = useState(0); // 입찰 금액 상태
    const [bidDate, setBidDate] = useState(''); // 입찰 날짜 상태
    const navigate = useNavigate(); // 페이지 리디렉션을 위한 navigate 객체

    const loadPostDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPostDetail(id); // 게시글 ID로 API 호출
            setPost(data);
        } catch (err) {
            setError('게시글을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const loadBids = async () => {
        try {
            const data = await fetchBids(id); // 게시글 ID로 입찰 데이터 호출
            setBids(data.bids); // BidListResponseDto의 bids 배열 저장
        } catch (err) {
            console.error('입찰 데이터를 불러오는 데 실패했습니다.', err);
            setError('입찰 데이터를 불러오는 데 실패했습니다.');
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
            await createBid(id, requestDto, 1); // userId=1과 함께 요청 전송
            alert('입찰이 성공적으로 등록되었습니다.');
            setShowModal(false); // 모달 닫기
            loadBids(); // 입찰 데이터 새로고침
        } catch (err) {
            console.error('입찰 등록에 실패했습니다.', err);
            alert('입찰 등록에 실패했습니다.');
        }
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
                        <div className="card-header d-flex justify-content-between align-items-center purple-bg text-white">
                            <h2 className="card-title mb-0">{post.title}</h2>
                        </div>

                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    {post.imgUrls && post.imgUrls.length > 0 && (
                                        <img
                                            src={post.imgUrls[0]}
                                            alt={post.title}
                                            className="img-fluid rounded"
                                            style={{
                                                objectFit: 'contain',
                                                maxHeight: '350px',
                                                width: '100%',
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="col-md-6 d-flex align-items-center">
                                    <ul className="list-group w-100">
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

                            {/* 입찰하기 버튼 */}
                            <div className="mt-4">
                                <Button variant="primary" onClick={() => setShowModal(true)}>
                                    입찰하기
                                </Button>
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
                                    onChange={(e) => setBidPrice(Number(e.target.value))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">입찰 날짜</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={bidDate}
                                    onChange={(e) => setBidDate(e.target.value)}
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
                    <div className="card mt-4 shadow">
                        <div className="card-header">
                            <h5>입찰 현황</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-column">
                                {bids.length > 0 ? (
                                    bids.map((bid, index) => (
                                        <div
                                            key={index}
                                            className="d-flex justify-content-between align-items-start mb-3 p-3 border rounded"
                                        >
                                            <div className="d-flex flex-column w-75">
                                                <div className="mb-2">
                                                    <strong>입찰자:</strong> {bid.bidderName}
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
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
