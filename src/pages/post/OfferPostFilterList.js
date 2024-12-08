import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostList.css';
import { fetchFilteredPostList } from './Api'; // 필터링된 API 호출 함수
import { useLocation, Link, useNavigate } from 'react-router-dom';

const OfferPostFilterList = () => {
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 필터 데이터 가져오기
    const { keyword, selectedCategory, selectedAddress } = location.state || {};

    const loadFilteredPosts = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFilteredPostList(page, { keyword, selectedCategory, selectedAddress });
            setPosts(data.postList);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('필터링된 데이터를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageClick = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        loadFilteredPosts(currentPage);
    }, [currentPage, keyword, selectedCategory, selectedAddress]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="purple-text">필터링된 글 목록</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    뒤로 가기
                </button>
            </div>

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-danger">{error}</p>}

            <div className="row">
                {posts.map((post) => (
                    <div className="col-md-4 mb-3" key={post.id}>
                        <div className="card" style={{ fontSize: '0.9rem' }}>
                            {post.imgUrls && post.imgUrls.length > 0 && (
                                <img
                                    src={post.imgUrls[0]}
                                    alt={post.title}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-header purple-bg text-white">{post.title}</div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li><strong>가격:</strong> {post.price.toLocaleString()} 원</li>
                                    <li><strong>기간:</strong> {post.duration}</li>
                                </ul>
                                <Link to={`/posts/${post.id}`} className="btn m-2 btn-primary">상세 보기</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50px',
                marginBottom: '50px'
            }}>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center" style={{ display: 'flex', flexDirection: 'row' }}>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handleFirstPage} aria-label="First">
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handlePreviousPage}>
                                <span aria-hidden="true">&#8249;</span>
                            </button>
                        </li>
                        {Array.from({ length: 5 }, (_, index) => {
                            const pageNum = currentPage - 2 + index;
                            if (pageNum < 1 || pageNum > totalPages) return null;
                            return (
                                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageClick(pageNum)}>
                                        {pageNum}
                                    </button>
                                </li>
                            );
                        })}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handleNextPage}>
                                <span aria-hidden="true">&#8250;</span>
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handleLastPage}>
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default OfferPostFilterList;
