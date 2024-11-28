import React, {useEffect, useState, useRef} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './ChatRoom.css';

const ChatRoom = () => {
    const {chatRoomId} = useParams();
    const [opponentFullName, setOpponentFullName] = useState([]);
    const [bid, setBid] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // TODO: 실제 로그인한 유저의 id 반영할 것
    const [loginUserId] = useState(1);

    // 채팅 전송 관련 (stomp)
    const [stompClient, setStompClient] = useState(null);
    const messageRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // 파일 상태 추가
    const fileInputRef = useRef(null); // 파일 입력을 위한 ref 추가

    useEffect(() => {
        connect();
        fetchMessages();
        scrollToBottom();

        return () => disconnect();
    }, [chatRoomId]);

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
            setBid(response.data.bidResponseDto);
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
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

    const formatDate = (date) => {
        const options = {hour: '2-digit', minute: '2-digit', hour12: true}; // 12시간 형식
        return new Date(date).toLocaleTimeString('ko-KR', options);
    };

    return (
        <div className="chat-container">
            <div className="left-container">
                <h2>{opponentFullName}</h2>
                <div className="d-flex flex-column justify-content-start">
                    <div ref={chatContainerRef} className="messages-container">
                        {messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div key={index}>
                                    <div className={`d-flex align-items-end ${message.sourceUserId === loginUserId ? 'justify-content-end' : 'justify-content-start'}`}>
                                        {message.sourceUserId === loginUserId && (
                                            <span className="message-time me-2">{formatDate(message.createdAt)}</span>
                                        )}
                                        <div className={`chat-message ${message.sourceUserId === loginUserId ? 'own' : 'other'}`}>
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
                                        {message.sourceUserId !== loginUserId && (
                                            <span className="message-time">{formatDate(message.createdAt)}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No messages found.</div>
                        )}
                    </div>
                    <div className="mt-5">
                        <div className="input-group mb-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="form-control" // 부트스트랩 스타일 적용
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                id="message"
                                ref={messageRef}
                                className="form-control" // 부트스트랩 스타일 적용
                                placeholder="메시지를 입력하세요..."
                            />
                            <button
                                className="btn btn-primary" // 부트스트랩 버튼 스타일 적용
                                onClick={sendChat}
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-container">
                {/*<button>고수 정보</button>*/}
                {/*<button>입찰 정보</button>*/}
                <h3>{bid.price}</h3>
            </div>
        </div>
    )
        ;
};

export default ChatRoom;
