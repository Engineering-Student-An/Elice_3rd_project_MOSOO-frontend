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
import {CreatePost, OfferPostList, PostDetail, RequestPostList} from "./pages/post";
import {MainPage} from "./pages";
import {CategoryList, CreateFirstCategory, CreateSubCategory, UpdateCategory} from "./pages/category";

const App = () => {
    return (
        <Router>
            <div id="root">
                <Header/>
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<MainPage />} /> {/* 메인 페이지 */}

                        <Route path="/requestPosts" element={<RequestPostList/>}/> {/* 게시글 목록 화면 */}
                        <Route path="/offerPosts" element={<OfferPostList/>}/> {/* 게시글 목록 화면 */}
                        <Route path="/createPost" element={<CreatePost/>}/> {/* 게시글 작성 화면 */}
                        <Route path="/posts/:id" element={<PostDetail/>}/> {/* 게시글 상세 화면 */}

                        <Route path="/chatrooms" element={<ChatRoomList/>}/> {/* 채팅방 목록 화면 */}
                        <Route path="/chatroom/:chatRoomId" element={<ChatRoom/>}/> {/* 채팅방 화면 */}

                        <Route path="/categories" element={<CategoryList/>}/> {/* 카테고리 관리 화면 */}
                        <Route path="/categories/createfirst" element={<CreateFirstCategory/>}/> {/* 카테고리 대분류 생성 화면 */}
                        <Route path="/categories/createsub/:category_id" element={<CreateSubCategory/>}/> {/* 카테고리 하위 분류 생성 화면 */}
                        <Route path="/categories/update/:category_id" element={<UpdateCategory/>}/> {/* 카테고리 수정 화면 */}
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
};

export default App;
