import React, {useEffect, useRef, useState} from 'react';

import axios from 'axios';
import './ChatRoomList.css';
import ChatSettingModal from "./ChatSettingModal";

const ChatRoomList = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpenIndex, setModalOpenIndex] = useState(null); // 모달이 열려 있는 인덱스
    const buttonRefs = useRef([]); // 버튼 참조를 위한 배열


    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chatrooms?page=${currentPage}`);
                setChatRooms(response.data.chatRoomResponseDtoList); // DTO에서 채팅방 목록 가져오기
                setTotalPages(response.data.totalPages);
            } catch (err) {
                setError(err);
                console.error('Failed to load chat rooms:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChatRooms();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading chat rooms: {error.message}</div>;
    }

    const formatDate = (date) => {
        const options = {hour: '2-digit', minute: '2-digit', hour12: true}; // 12시간 형식
        return new Date(date).toLocaleTimeString('ko-KR', options);
    };

    const handleOpenModal = (index) => {
        setModalOpenIndex(index); // 클릭한 버튼의 인덱스를 설정
    };

    const handleCloseModal = () => {
        setModalOpenIndex(null); // 모달 닫기
    };

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
            <div className="chat-room-container">
                <div style={{position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '99'}}>
                    <h2>채팅</h2>
                </div>

                <ul>
                    {chatRooms.map((chatRoom, index) => (
                        <div className="chat-room-inner-container" key={chatRoom.chatRoomId}>

                            <li>
                                <div className="d-flex flex-row justify-content-between">
                                    <h3 className="mb-2">{chatRoom.opponentFullName}</h3>
                                    <button ref={el => buttonRefs.current[index] = el} // 각 버튼을 refs 배열에 저장
                                            className="three-dots-button mb-3"
                                            onClick={() => handleOpenModal(index)} // 인덱스를 인자로 전달
                                    >
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </button>
                                    <ChatSettingModal
                                        isOpen={modalOpenIndex === index} // 해당 인덱스와 비교하여 모달 열기
                                        onRequestClose={handleCloseModal}
                                        chatRoomId={chatRoom.chatRoomId}
                                        buttonRef={buttonRefs.current[index]} // 해당 버튼의 참조 전달
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-between">
                                    {/*채팅 메시지 15자리까지 보여주고 나머지는 ... 으로 치환*/}
                                    <a href={`/chatroom/${chatRoom.chatRoomId}`}>
                                        {chatRoom.lastChatMessage.length > 15
                                            ? `${chatRoom.lastChatMessage.substring(0, 15)}...`
                                            : chatRoom.lastChatMessage}
                                    </a>

                                    {/*시간 형식을 오전,오후 몇시 몇분 으로 설정*/}
                                    <p>
                                        {chatRoom.lastChatDate ? formatDate(chatRoom.lastChatDate) : null}
                                    </p>
                                </div>

                            </li>
                        </div>
                    ))}

                </ul>
            </div>

            {/* 페이징 버튼 */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50px',
                marginBottom: '50px'
            }}>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center" style={{display: 'flex', flexDirection: 'row'}}>
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
                            <button className="page-link" onClick={handleLastPage}
                                    disabled={currentPage === totalPages}>
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>

            </div>
        </div>


    )
        ;
};

export default ChatRoomList;
