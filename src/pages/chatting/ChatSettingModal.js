import React from 'react';
import Modal from 'react-modal';
import axios from "axios";

const ChatSettingModal = ({ isOpen, onRequestClose, chatRoomId, buttonRef }) => {

    const handleLeaveChatRoom = async () => {
        try {
            // API 호출
            await axios.delete(`http://localhost:8080/api/chatroom/${chatRoomId}`);
            alert('채팅방을 나갔습니다.');

            // 페이지를 '/chatrooms'로 이동
            window.location.href = '/chatrooms';

        } catch (error) {
            console.error('채팅방 나가기 중 에러가 발생했습니다: ', error);
            // 에러 처리 로직을 추가할 수 있습니다.
        }
    };


    const handleCloseModal = () => {
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCloseModal}
            style={{
                content: {
                    position: 'absolute',
                    top: buttonRef ? buttonRef.getBoundingClientRect().bottom : 'auto',
                    left: buttonRef ? buttonRef.getBoundingClientRect().right - 200 : 'auto', // 버튼의 오른쪽 끝에서 모달 너비만큼 왼쪽으로 이동
                    width: '200px',
                    height: '150px',
                    padding: '0',
                    marginTop: '5px',
                    borderRadius: '10px',
                },
                overlay: {
                    backgroundColor: 'rgba(0,0,0,0.23)',
                    zIndex: '100',
                }
            }}
        >
            <div className="d-flex flex-column justify-content-evenly align-items-center" style={{height: '100%', padding: '10px'}}>
                <button className="btn btn-light" style={{width: '100%'}} onClick={handleLeaveChatRoom}>
                    채팅방 나가기
                </button>
                <button className="btn btn-light" style={{width: '100%'}}>신고하기</button>
            </div>
        </Modal>
    );
};

export default ChatSettingModal;
