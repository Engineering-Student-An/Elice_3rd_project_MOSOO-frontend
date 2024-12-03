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
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState('postInfo');
    const [modalOpenIndex, setModalOpenIndex] = useState(null); // 모달이 열려 있는 인덱스
    const buttonRefs = useRef([]); // 버튼 참조를 위한 배열
    const [hasMore, setHasMore] = useState(true);   // 로드할 메시지가 더 있는지 여부
    const [lastIndex, setLastIndex] = useState();   // 불러온 채팅의 마지막 인덱스 (id)

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
        fetchInitialMessages();
        return () => disconnect();
    }, [chatRoomId]);

    // 컴포넌트가 처음 마운트될 때 일정 시간(ms) 후에 scrollToBottom 호출
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 300); // 300ms 후에 scrollToBottom 실행

        return () => clearTimeout(timer); // 클린업: 컴포넌트 언마운트 시 타이머 정리
    }, []);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const client = Stomp.over(socket);
        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            setStompClient(client);

            client.subscribe(`/sub/${chatRoomId}`, (chatMessage) => {
                fetchInitialMessages();
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
                fileName: selectedFile ? selectedFile.name : null,
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
            }, 300);
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

    // 처음 메시지 로드 => 최근 20개만
    const fetchInitialMessages = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/api/chatroom/${chatRoomId}`);
            const initialMessages = response.data.chatMessageResponseDtoList;
            setMessages(initialMessages);
            setOpponentFullName(response.data.opponentFullName);

            const lastMessage = initialMessages[initialMessages.length - 1];
            if (lastMessage) {
                setLastIndex(lastMessage.chatMessageId);
            }

            setTimeout(() => {
                scrollToBottom();
            }, 300);

        } catch (err) {
            setErrorMessage(err);
            console.error('Failed to load messages:', err);
        }
    };

    const fetchMoreMessages = async () => {
        if (!hasMore) return;

        try {
            const response = await axios.get(`http://localhost:8080/api/chatroom/${chatRoomId}?index=` + lastIndex);
            const newMessages = response.data.chatMessageResponseDtoList;
            setMessages(prevMessages => [...prevMessages, ...newMessages]); // 가장 아래에 추가
            setHasMore(newMessages.length > 0); // 더 이상 메시지가 없으면 false

            // 스크롤을 조정
            if (newMessages.length > 0) {

                setLastIndex(newMessages[newMessages.length - 1].chatMessageId);

                // 추가된 메시지 중 마지막 메시지의 위치로 스크롤 이동
                setTimeout(() => {
                    scrollToMessage(newMessages.length - 1); // 마지막 추가된 메시지로 스크롤
                }, 0);
            }
        } catch (err) {
            setErrorMessage(err.response ? err.response.data.message : err.message);
            console.error('Failed to load more messages:', err);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (chatContainerRef.current.scrollTop === 0) {
                fetchMoreMessages(); // 스크롤이 맨 위에 도달하면 이전 메시지 로드
            }
        };

        const scrollElement = chatContainerRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, messages]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
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
        }
    };

    // 특정 인덱스의 메시지로 스크롤 조정하는 함수
    const scrollToMessage = (index) => {
        if (chatContainerRef.current) {
            const messageElements = chatContainerRef.current.children;
            if (messageElements[index]) {
                messageElements[index].scrollIntoView(); // 즉시 스크롤 이동
            }
        }
    };

    if (errorMessage) {
        return <div> {errorMessage} </div>;
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
                            messages.slice().reverse().map((message, index) => {
                                // 현재 메시지의 시간
                                const currentTime = formatDate(message.createdAt);
                                // 다음 메시지의 시간 및 발신자 ID (마지막 메시지일 경우 undefined)
                                const nextMessage = index < messages.length - 1 ? messages[messages.length - 1 - index - 1] : null;
                                const nextTime = nextMessage ? formatDate(nextMessage.createdAt) : null;
                                const nextSenderId = nextMessage ? nextMessage.sourceUserId : null;

                                // 상태를 유지하는 변수 초기화
                                let showTime = false;

                                // 현재 메시지와 다음 메시지를 비교
                                if (nextTime === currentTime && message.sourceUserId === nextSenderId) {
                                    // 동일한 시간과 발신자인 경우 마지막 메시지에만 시간 표시
                                    showTime = index === 0; // 첫 번째 메시지에만 시간을 표시
                                } else {
                                    // 발신자나 시간이 다르면 시간 표시
                                    showTime = true;
                                }

                                return (
                                    <div key={index}>
                                        {message.type === "QUIT" || message.type === "ENTER" ? (
                                            <div className="text-center">
                                                <p>{message.content}</p> {/* 여기서 content를 원하는 메시지로 설정 */}
                                            </div>
                                        ) : (
                                        <div
                                            className={`d-flex align-items-end ${message.sourceUserId === loginUserId ? 'justify-content-end' : 'justify-content-start'}`}>
                                            {/* 시간 표시 조건 */}
                                            {showTime && message.sourceUserId === loginUserId && (
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
                                                        {message.fileName}
                                                    </a>
                                                ) : (
                                                    <span>{message.content}</span>
                                                )}
                                            </div>
                                            {/* 시간 표시 조건 */}
                                            {showTime &&  message.sourceUserId !== loginUserId && (
                                                <span className={`message-time`}>{currentTime}</span>
                                            )}
                                        </div>)}
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
                            <label htmlFor="file-upload" className="btn btn-light"
                                   style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <span className="material-icons">upload_file</span>
                            </label>
                            <input
                                type="text"
                                id="message"
                                ref={messageRef}
                                value={inputMessage} // 현재 메시지 상태 사용
                                onChange={(e) => setInputMessage(e.target.value)} // 입력값 변경 시 상태 업데이트
                                className="form-control"
                                placeholder={!selectedFile ? "메시지를 입력하세요..." : "파일 선택 시 메시지는 입력 불가합니다."}
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
                    <button className="purple-button" style={{padding: '10px', marginRight: '10px'}}
                            onClick={() => handleCompButtonClick('postInfo')}>거래 상세 정보
                    </button>
                    <button className="purple-button" style={{padding: '10px'}}
                            onClick={() => handleCompButtonClick('opponentInfo')}>상대 프로필
                    </button>

                </div>

                <div className="info-container">
                    {selectedComponent === 'postInfo' && <PostInfo chatRoomId={chatRoomId}/>}
                    {selectedComponent === 'opponentInfo' && <OpponentInfo chatRoomId={chatRoomId}/>}
                </div>
            </div>
        </div>
    )
        ;
};

export default ChatRoom;
