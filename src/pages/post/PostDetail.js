import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostList.css';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostDetail, deletePost } from './Api';

const PostDetail = () => {
    const { id } = useParams(); // URL에서 게시글 ID 추출
    const [post, setPost] = useState(null); // 게시글 데이터 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const navigate = useNavigate(); // 페이지 리디렉션을 위한 navigate 객체

    // 게시글 상세 데이터 로드
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

    // 페이지 로드 시 게시글 상세 데이터 호출
    useEffect(() => {
        loadPostDetail();
    }, [id]);

    // 게시글 삭제 함수
    const handleDelete = async () => {
        try {
            await deletePost(id); // deletePost 호출하여 게시글 삭제
            alert('게시글이 삭제되었습니다.');
            navigate('/posts'); // 게시글 목록 페이지로 리디렉션
        } catch (err) {
            setError('게시글 삭제에 실패했습니다.');
        }
    };

    // 게시글 수정 함수
    const handleEdit = () => {
        navigate(`/edit-post/${id}`); // 수정 페이지로 이동
    };

    // 로딩 중
    if (loading) {
        return <p>로딩 중...</p>;
    }

    // 에러 처리
    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    // 게시글이 없을 경우
    if (!post) {
        return <p>{id} 게시글을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header d-flex justify-content-between align-items-center bg-purple text-white">
                            <h2 className="card-title mb-0">{post.title}</h2>
                            <div className="dropdown">
                                <button
                                    className="btn btn-light btn-sm dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    ...
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                    <li>
                                        <button className="dropdown-item" onClick={handleEdit}>
                                            게시글 수정
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleDelete}>
                                            게시글 삭제
                                        </button>
                                    </li>
                                </ul>
                            </div>
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
                                                maxHeight: '300px',
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
