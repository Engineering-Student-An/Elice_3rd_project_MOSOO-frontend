import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDeleteUserList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users/delete?page=${currentPage}`); // API 엔드포인트에 맞게 수정
                setMembers(response.data.memberList); // 응답 데이터에 맞게 수정
                setTotalPages(response.data.totalPages);
            } catch (err) {
                setError('사용자 목록을 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [currentPage]);

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

    return (
        <div>
            <h3 className="m-4">탈퇴 사용자 목록</h3>
            <ul>
                {members.map((member) => (
                    <div className="m-4">
                        <li key={member.id}>{member.fullName} ({member.email})</li>
                        <p>{member.deleteAt}</p>
                        <p>{member.deleteReason}</p>
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

export default AdminDeleteUserList;
