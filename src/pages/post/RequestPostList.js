import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostList.css';
import { fetchPostList } from './Api'; // API 호출 함수

const RequestPostList = () => {
    const [posts, setPosts] = useState([]); // 게시글 목록
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 게시글 데이터 로드
    const loadPosts = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPostList(page, false);
            setPosts(data.postList);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('데이터를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page); // 페이지 상태 업데이트
        }
    };

    // 페이지 변경 시 데이터 로드
    useEffect(() => {
        loadPosts(currentPage); // 현재 페이지 기반 데이터 호출
    }, [currentPage]);

    return (
        <div className="container mt-4">
            <h2 className="text-left mb-4 purple-text">요청 목록</h2>

            {/* 로딩 상태 */}
            {loading && <p>로딩 중...</p>}

            {/* 에러 메시지 */}
            {error && <p className="text-danger">{error}</p>}

            {/* 게시글 카드 */}
            <div className="row">
                {posts.map((post) => (
                    <div className="col-md-4 mb-3" key={post.id}>
                        <div className="card" style={{ fontSize: '0.9rem' }}>
                            {/* 게시글 카드 이미지 */}
                            {post.ImgUrls && post.ImgUrls.length > 0 && (
                                <img
                                    src={post.ImgUrls[0]}  // 이미지 링크 배열에서 첫 번째 이미지 사용
                                    alt={post.title}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-header purple-bg text-white">{post.title}</div>
                            <div className="card-body">
                                <p className="card-text">{post.description}</p>
                                <ul className="list-unstyled">
                                    <li><strong>가격:</strong> {post.price.toLocaleString()} 원</li>
                                    <li><strong>기간:</strong> {post.duration}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <div className="btn-group">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                className={`btn ${
                                    currentPage === index + 1
                                        ? 'btn-primary'
                                        : 'btn-outline-primary'
                                }`}
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestPostList;
