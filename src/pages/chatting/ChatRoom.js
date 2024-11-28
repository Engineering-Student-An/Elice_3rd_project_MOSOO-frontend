import React, {useEffect, useState, useRef} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './ChatRoom.css';
import '../../components/button.css';
import PostInfo from "./PostInfo";
import OpponentInfo from "./OpponentInfo";
import ChatSettingModal from "./ChatSettingModal";

const ChatRoom = () => {
    const {chatRoomId} = useParams();
    const [opponentFullName, setOpponentFullName] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [price, setPrice] = useState(0);
    const [isGosu, setIsGosu] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState('postInfo');
    const [modalOpenIndex, setModalOpenIndex] = useState(null); // 모달이 열려 있는 인덱스
    const buttonRefs = useRef([]); // 버튼 참조를 위한 배열

    // TODO: 실제 로그인한 유저의 id 반영할 것
    const [loginUserId] = useState(4);

    // 채팅 전송 관련 (stomp)
    const [stompClient, setStompClient] = useState(null);
    const messageRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // 파일 상태 추가
    const fileInputRef = useRef(null); // 파일 입력을 위한 ref 추가
    const [previewUrl, setPreviewUrl] = useState(null);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        connect();
        fetchMessages();

        return () => disconnect();
    }, [chatRoomId]);

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const client = Stomp.over(socket);
        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            setStompClient(client);

            client.subscribe(`/sub/${chatRoomId}`, (chatMessage) => {
                fetchMessages();
            });
        });
    };

    const disconnect = () => {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    };

    const sendChat = async () => {
        // STOMP 클라이언트 연결 상태 확인
        if (!stompClient || !stompClient.connected) {
            console.error('STOMP client is not connected. Attempting to reconnect...');
            connect(); // 재연결 시도
            return;
        }

        if (!isSending) {
            setIsSending(true);

            const messageContent = messageRef.current.value;
            const chatMessage = {
                sourceUserId: loginUserId,
                type: selectedFile ? "FILE" : "MESSAGE",
                base64File: selectedFile ? await toBase64(selectedFile) : null, // Base64로 변환
                content: messageContent ? messageContent : null
            };

            stompClient.send(`/pub/${chatRoomId}`, {}, JSON.stringify(chatMessage));

            messageRef.current.value = '';
            setInputMessage('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // 파일 입력도 초기화
            }

            setTimeout(() => {
                setIsSending(false);
            }, 500);
        }
    };

    // 파일을 Base64로 변환하는 함수
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chatroom/${chatRoomId}`);
            setMessages(response.data.chatMessageResponseDtoList);
            setOpponentFullName(response.data.opponentFullName);
            setPost(response.data.postResponseDto);
            setPrice(response.data.price);
            setIsGosu(response.data.isGosu);
        } catch (err) {
            setError(err);
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("fileNAme: " + file.name);
        setSelectedFile(file); // 파일 선택 시 상태 업데이트
        messageRef.current.value = ''; // 메시지 입력 필드 초기화
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleFileDelete = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
    }

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.querySelector('& > div:last-child').scrollIntoView();
            // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                Error loading messages: {error.response ? error.response.data.message : error.message}
            </div>
        );
    }

    const handleCompButtonClick = (component) => {
        setSelectedComponent(component);
    };

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


    return (
        <div className="chat-container">
            <div className="left-container">
                <div className="d-flex flex-row justify-content-between">
                    <h2>{opponentFullName}</h2>
                    <div className="d-flex flex-row justify-content-between align-items-center">

                        <a href="/" className="purple-button me-5">결제하기</a>

                        <button ref={el => buttonRefs.current[0] = el} // 각 버튼을 refs 배열에 저장
                                className="three-dots-button"
                                onClick={() => handleOpenModal(0)} // 인덱스를 인자로 전달
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <ChatSettingModal
                            isOpen={modalOpenIndex === 0} // 해당 인덱스와 비교하여 모달 열기
                            onRequestClose={handleCloseModal}
                            chatRoomId={chatRoomId}
                            buttonRef={buttonRefs.current[0]} // 해당 버튼의 참조 전달
                        />
                    </div>
                </div>

                <div className="d-flex flex-column justify-content-start">
                    <div ref={chatContainerRef} className="messages-container">
                        {messages.length > 0 ? (
                            messages.map((message, index) => {
                                // 현재 메시지의 시간
                                const currentTime = formatDate(message.createdAt);
                                // 다음 메시지의 시간 (마지막 메시지일 경우 undefined)
                                const nextTime = index < messages.length - 1 ? formatDate(messages[index + 1].createdAt) : null;

                                // 현재 메시지의 시간이 다음 메시지의 시간과 같은지 확인
                                const isLastInGroup = nextTime !== currentTime;

                                return (
                                    <div key={index}>
                                        <div
                                            className={`d-flex align-items-end ${message.sourceUserId === loginUserId ? 'justify-content-end' : 'justify-content-start'}`}>
                                            {/* 마지막 메시지에만 시간 표시 */}
                                            {isLastInGroup && message.sourceUserId === loginUserId && (
                                                <span className={`message-time`}>{currentTime}</span>
                                            )}
                                            <div
                                                className={`chat-message ${message.sourceUserId === loginUserId ? 'own' : 'other'}`}>
                                                {message.type === "IMAGE" ? (
                                                    <img src={message.content} alt="Chat Image" className="chat-image"/>
                                                ) : message.type === "VIDEO" ? (
                                                    <video controls className="chat-video">
                                                        <source src={message.content} type="video/mp4"/>
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : message.type === "FILE" ? (
                                                    <a href={message.content} download className="file-download-link">
                                                        Download File
                                                    </a>
                                                ) : (
                                                    <span>{message.content}</span>
                                                )}
                                            </div>
                                            {isLastInGroup && message.sourceUserId !== loginUserId && (
                                                <span className={`message-time`}>{currentTime}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div>No messages found.</div>
                        )}
                    </div>

                    <div className="mt-5">

                        <div className="input-group mb-2">
                            {/* 미리보기 영역 */}
                            {selectedFile && (
                                <div>
                                    <div className="d-flex flex-row justify-content-between align-items-center">
                                        <p>파일 미리보기</p>
                                        <button
                                            onClick={handleFileDelete}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                color: 'red'
                                            }}
                                        >
                                            &times; {/* X자 표시 */}
                                        </button>
                                    </div>

                                    <div className="preview-container">

                                        {selectedFile && selectedFile.type.startsWith('image/') && (
                                            <img src={previewUrl} alt="미리보기" className="img-fluid"/>
                                        )}
                                        <p>{selectedFile.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="form-control"
                                onChange={handleFileChange}
                                style={{display: 'none'}} // 파일 입력을 숨김
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="btn btn-light" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <span className="material-icons">upload_file</span>
                            </label>
                            <input
                                type="text"
                                id="message"
                                ref={messageRef}
                                value={inputMessage} // 현재 메시지 상태 사용
                                onChange={(e) => setInputMessage(e.target.value)} // 입력값 변경 시 상태 업데이트
                                className="form-control"
                                placeholder={ !selectedFile ? "메시지를 입력하세요..." : "파일 선택 시 메시지는 입력 불가합니다." }
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !selectedFile) { // 파일이 업로드되지 않은 경우에만 메시지 전송
                                        sendChat();
                                        e.preventDefault(); // 기본 엔터 키 동작 방지 (폼 전송 등)
                                    }
                                }}
                                disabled={selectedFile} // 파일이 업로드되면 입력 필드 비활성화
                            />
                            <button className="btn btn-light"
                                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                    onClick={sendChat}
                                    disabled={inputMessage.trim() === '' && !selectedFile} // 메시지가 비어있고 파일이 선택되지 않은 경우 버튼 비활성화
                                >
                            <span className="material-icons">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-container">
                <div className="button-container">
                    <button className="purple-button" style={{padding: '10px', marginRight: '10px'}} onClick={() => handleCompButtonClick('postInfo')}>거래 상세 정보</button>
                    <button className="purple-button" style={{padding: '10px'}} onClick={() => handleCompButtonClick('opponentInfo')}>상대 프로필</button>

                </div>

                <div className="info-container">
                    {selectedComponent === 'postInfo' && <PostInfo post={post} price={price} chatRoomId={chatRoomId} isGosu={isGosu} />}
                    {selectedComponent === 'opponentInfo' && <OpponentInfo opponentFullName={opponentFullName}/>}
                </div>
            </div>
        </div>
    )
        ;
};

export default ChatRoom;
