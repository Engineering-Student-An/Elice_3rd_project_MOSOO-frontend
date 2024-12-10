import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMembers();
    }, [currentPage]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users?page=${currentPage}`); // API 엔드포인트에 맞게 수정
            setMembers(response.data.memberList); // 응답 데이터에 맞게 수정
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('사용자 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleFirstPage = () => {
        if (currentPage > 1) {
            setCurrentPage(1);
        }
    };

    const handleLastPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(totalPages);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleWithdrawal = async (memberId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users/${memberId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // 성공적으로 회원 탈퇴가 완료된 경우 처리
                alert('회원 탈퇴가 완료되었습니다.');
                fetchMembers();
            } else {
                // 에러 처리
                alert('회원 탈퇴에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">사용자 목록</h3>
                <a href="/admin/deleted-users" className="me-4">탈퇴 목록</a>
            </div>

            <ul>
            {members.map((member) => (
                <div className="d-flex justify-content-start mb-3">
                    <button
                        style={{
                            marginRight: '20px',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: 'red'
                        }}
                        onClick={() => handleWithdrawal(member.id)}
                    >
                        <span className="material-icons">delete</span>
                    </button>
                    <li key={member.id}>{member.fullName} ({member.email})</li>

                </div>
            ))}
            </ul>

            {/* 페이징 버튼 */}
            {totalPages > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '50px',
                    marginBottom: '50px'
                }}>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center"
                            style={{display: 'flex', flexDirection: 'row'}}>
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
                            {/* 페이지 번호 버튼 생성 */}
                            {Array.from({length: 5}, (_, index) => {
                                const pageNum = currentPage - 2 + index; // 현재 페이지를 기준으로 5개 생성
                                if (pageNum < 1 || pageNum > totalPages) return null; // 페이지 번호가 유효하지 않으면 null 반환
                                return (
                                    <li key={pageNum}
                                        className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
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
                                <button className="page-link" onClick={handleLastPage}
                                        disabled={currentPage === totalPages}>
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>

                </div>
            )}
        </div>
    );
};

export default AdminUserList;
