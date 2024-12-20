import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./assets/css/LineIcons.2.0.css";
import "./assets/css/animate.css";
import "./assets/css/tiny-slider.css";
import "./assets/css/glightbox.min.css";
import "./assets/css/main.css";

import {
    Header,
    Footer,
    AdminRoute,
    AccessDeniedPage,
    ProtectedRoute,
} from "./components";
import {ChatRoomList, ChatRoom} from "./pages/chatting";
import {
    CreatePost,
    CreateReview,
    OfferPostList,
    PostDetail,
    RequestPostList,
    OfferPostFilterList,
} from "./pages/post";
import {MainPage} from "./pages";
import {
    CategoryList,
    CreateFirstCategory,
    CreateSubCategory,
    UpdateCategory,
} from "./pages/category";

import SignUp from "./pages/user/login-signup/SignUp";
import Login from "./pages/user/login-signup/Login";
import  AuthHandler from "./pages/user/login-signup/AuthHandler";

import MyPage from "./pages/user/userinfo/MyPage";
import TechProvide from "./pages/user/userinfo/TechProvide";
import TechProvideEdit from "./pages/user/userinfo/TechProvideEdit";

import {Payment} from "./pages/payment";
import PaymentComplete from "./pages/payment/PaymentComplete";
import UsageList from "./pages/usage/UsageList";
import GoogleTokenCheck from "./pages/user/login-signup/GoogleTokenCheck";
import AdminDeleteUserList from "./pages/admin/AdminDeleteUserList";
import MyPosts from "./pages/post/mypage/MyPosts";
import MyReviews from "./pages/post/mypage/MyReviews";
import {MyBids} from "./pages/post/mypage";

const App = () => {
    return (
        <Router>
            <div id="root">
                <Header/>
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<MainPage/>}/> {/* 메인 페이지 */}
                        <Route
                            path="/access-denied"
                            element={<AccessDeniedPage/>}
                        ></Route>{" "}
                        {/*관리자 권한이 없을 때의 페이지*/}
                        <Route path="/SignUp" element={<SignUp/>}/>{" "}
                        {/* 회원 가입 페이지 */}
                        <Route path="/Login" element={<Login/>}/> {/* 로그인 페이지 */}
                        <Route path="/auth" element={<AuthHandler/>}/>{" "}
                        {/* 구글 Auth 로그인 */}
                        <Route
                            path="/MyPage"
                            element={
                                <ProtectedRoute>
                                    <MyPage/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 유저 마이 페이지*/}
                        <Route path="/tokenCheck" element={<GoogleTokenCheck/>}/>{" "}
                        {/* Google로그인 후 토큰 저장 */}
                        <Route path="/TechProvide" element={<ProtectedRoute><TechProvide/></ProtectedRoute>}/>{" "}
                        {/* 기술 제공 전환 페이지 */}
                        <Route path="/TechProvideEdit" element={<ProtectedRoute><TechProvideEdit/></ProtectedRoute>}/>{" "}
                        {/* 기술 제공 정보 수정 페이지 */}
                        <Route
                            path="/admin/deleted-users"
                            element={
                                <AdminRoute>
                                    {" "}
                                    <AdminDeleteUserList/>{" "}
                                </AdminRoute>
                            }
                        />
                        <Route path="/requestPosts" element={<RequestPostList/>}/>{" "}
                        {/* 게시글 목록 화면 */}
                        <Route path="/offerPosts" element={<OfferPostList/>}/>{" "}
                        {/* 게시글 목록 화면 */}
                        <Route
                            path="/offerPostsFilter"
                            element={<OfferPostFilterList/>}
                        />{" "}
                        {/* 게시글 목록 화면 */}
                        <Route
                            path="/createPost"
                            element={
                                <ProtectedRoute>
                                    <CreatePost/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 게시글 작성 화면 */}
                        <Route path="/posts/:id" element={<PostDetail/>}/>{" "}
                        {/* 게시글 상세 화면 */}
                        <Route
                            path="/review/:id"
                            element={
                                <ProtectedRoute>
                                    <CreateReview/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 리뷰 작성 화면 */}
                        <Route
                            path="/chatrooms"
                            element={
                                <ProtectedRoute>
                                    <ChatRoomList/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 본인 게시글 조회 화면 */}
                        <Route
                            path="/myPosts"
                            element={
                                <ProtectedRoute>
                                    <MyPosts/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 본인 입찰 조회 화면 */}
                        <Route
                            path="/myBids"
                            element={
                                <ProtectedRoute>
                                    <MyBids/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 본인 리뷰 조회 화면 */}
                        <Route
                            path="/myReviews"
                            element={
                                <ProtectedRoute>
                                    <MyReviews/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 채팅방 목록 화면 */}
                        <Route
                            path="/chatroom/:chatRoomId"
                            element={
                                <ProtectedRoute>
                                    <ChatRoom/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 채팅방 화면 */}
                        <Route
                            path="/payment/:chatroomId"
                            element={
                                <ProtectedRoute>
                                    <Payment/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/payment/success"
                            element={
                                <ProtectedRoute>
                                    <PaymentComplete/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 결제 완료 화면 */}
                        <Route
                            path="/usages"
                            element={
                                <ProtectedRoute>
                                    <UsageList/>
                                </ProtectedRoute>
                            }
                        />{" "}
                        {/* 카테고리 대분류 생성 화면 */}
                        <Route
                            path="/categories/createfirst"
                            element={
                                <AdminRoute>
                                    <CreateFirstCategory/>
                                </AdminRoute>
                            }
                        />{" "}
                        {/* 카테고리 하위 카테고리 생성 화면 */}
                        <Route
                            path="/categories/createsub/:categoryId"
                            element={
                                <AdminRoute>
                                    <CreateSubCategory/>
                                </AdminRoute>
                            }
                        />{" "}
                        {/* 카테고리 수정 화면 */}
                        <Route
                            path="/categories/update/:categoryId"
                            element={
                                <AdminRoute>
                                    <UpdateCategory/>
                                </AdminRoute>
                            }
                        />{" "}
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
};

export default App;

