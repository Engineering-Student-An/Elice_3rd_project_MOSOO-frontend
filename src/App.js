import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './assets/css/LineIcons.2.0.css';
import './assets/css/animate.css';
import './assets/css/tiny-slider.css';
import './assets/css/glightbox.min.css';
import './assets/css/main.css';

import {Header, Footer} from "./components";
import {ChatRoomList, ChatRoom} from "./pages/chatting";
import {CreatePost, OfferPostList, RequestPostList} from "./pages/post";

const App = () => {
    return (
        <Router>
            <div id="root">
                <Header/>
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/requestPosts" element={<RequestPostList/>}/> {/* 게시글 목록 화면 */}
                        <Route path="/offerPosts" element={<OfferPostList/>}/> {/* 게시글 목록 화면 */}
                        <Route path="/createPost" element={<CreatePost/>}/> {/* 게시글 목록 화면 */}

                        <Route path="/chatrooms" element={<ChatRoomList/>}/> {/* 채팅방 목록 화면 */}
                        <Route path="/chatroom/:chatRoomId" element={<ChatRoom/>}/> {/* 채팅방 화면 */}
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
};

export default App;
