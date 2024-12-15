import React, { useState, useEffect } from 'react';
import { getAllPosts } from './AllPostListApi'; // API 호출 함수 import
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {deletePost} from "../Api"; // React Router Link import

const AllPostList = () => {
    const [posts, setPosts] = useState([]); // 게시글 데이터
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 게시글 가져오기
    const fetchPosts = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllPosts(page);
            setPosts(data.postList); // 게시글 데이터
            console.log(data.postList);
            setTotalPages(data.totalPages); // 총 페이지 수
        } catch (err) {
            setError('게시글을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await deletePost(postId); // 게시글 삭제 API 호출
                alert('게시글이 삭제되었습니다.');
                fetchPosts(currentPage); // 현재 페이지 데이터 다시 가져오기
            } catch (err) {
                alert('게시글 삭제에 실패했습니다.');
                console.error('게시글 삭제 오류:', err);
            }
        }
    };

    useEffect(() => {
        fetchPosts(currentPage); // 현재 페이지 변경 시 게시글 데이터 가져오기
    }, [currentPage]);

    // 페이지네이션 버튼 핸들러
    const handleFirstPage = () => setCurrentPage(1);
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handleLastPage = () => setCurrentPage(totalPages);
    const handlePageClick = (page) => setCurrentPage(page);

    return (
        <div className="container mt-5">
            <h2>게시글 목록</h2>
            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <>
                    <ul className="list-group">
                        {posts.map((post) => (
                            <li
                                key={post.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h5>{post.title}</h5>
                                    <p>{post.fullName}</p>
                                </div>
                                {/* 고수 또는 일반 표시 및 바로가기 버튼 */}
                                <div className="d-flex align-items-center">
                                    <span
                                        className={`badge ${
                                            post.isOffer ? 'bg-success' : 'bg-secondary'
                                        } me-2`}
                                        style={{fontSize: '0.9rem'}}
                                    >
                                        {post.offer ? '고수' : '일반'}
                                    </span>
                                    <button
                                        className="btn btn-danger me-2"
                                        style={{
                                            fontSize: '0.9rem',
                                            padding: '8px 16px',
                                            border: 'none',
                                            borderRadius: '4px',
                                        }}
                                        onClick={() => handleDelete(post.id)} // 삭제 버튼 클릭 핸들러
                                    >
                                        삭제
                                    </button>
                                    <Link
                                        to={`/posts/${post.id}`} // 게시글 상세 링크
                                        className="btn btn-purple"
                                        aria-label="View Post"
                                        style={{
                                            backgroundColor: '#6f42c1', // 보라색
                                            color: 'white', // 하얀색 텍스트
                                            fontSize: '0.9rem',
                                            padding: '8px 16px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                        }}
                                    >
                                        바로가기
                                    </Link>
                                </div>

                            </li>
                        ))}
                    </ul>

                    {/* 페이지네이션 */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '50px',
                            marginBottom: '50px',
                        }}
                    >
                        <nav aria-label="Page navigation example">
                            <ul
                                className="pagination justify-content-center"
                                style={{ display: 'flex', flexDirection: 'row' }}
                            >
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={handleFirstPage}
                                        aria-label="First"
                                    >
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
                                        <li
                                            key={pageNum}
                                            className={`page-item ${
                                                currentPage === pageNum ? 'active' : ''
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageClick(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    );
                                })}
                                <li
                                    className={`page-item ${
                                        currentPage === totalPages ? 'disabled' : ''
                                    }`}
                                >
                                    <button className="page-link" onClick={handleNextPage}>
                                        <span aria-hidden="true">&#8250;</span>
                                    </button>
                                </li>
                                <li
                                    className={`page-item ${
                                        currentPage === totalPages ? 'disabled' : ''
                                    }`}
                                >
                                    <button className="page-link" onClick={handleLastPage}>
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
};

export default AllPostList;
