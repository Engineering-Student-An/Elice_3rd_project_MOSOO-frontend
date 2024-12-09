import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo/logo.png'; // Header.js의 위치에 따라 경로 조정

const Header = () => {
    const [token, setToken] = useState(localStorage.getItem('token')); // 로컬 스토리지에서 토큰 가져오기

    const handleLogout = () => {
        localStorage.removeItem('token'); // 토큰 삭제
        setToken(null); // 상태 업데이트
        window.location.href = '/'; // 메인 페이지로 이동
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token')); // 스토리지 변경 시 상태 업데이트
        };

        window.addEventListener('storage', handleStorageChange);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div>
            {/* Header Area */}
            <header className="header navbar-area" style={{borderBottom: '1px solid #EEEEEE', height: '100px', position: 'sticky'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="nav-inner">
                                <nav className="navbar navbar-expand-lg" style={{height: '95px'}}>
                                    <a className="navbar-brand" href="/">
                                        <img src={logo} style={{width:'130px'}} alt="Logo" />
                                    </a>
                                    <button
                                        className="navbar-toggler mobile-menu-btn"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#navbarSupportedContent"
                                        aria-controls="navbarSupportedContent"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                    >
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                    </button>
                                    <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                        <ul id="nav" className="navbar-nav d-flex ms-auto">
                                            <li className="nav-item">
                                                <a href="javascript:void(0)" aria-label="Toggle navigation">Home</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="javascript:void(0)" aria-label="Toggle navigation">입찰페이지</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="javascript:void(0)" aria-label="Toggle navigation">결제하기</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="javascript:void(0)" aria-label="Toggle navigation">이용내역</a>
                                            </li>
                                            <li className="nav-item ms-auto">
                                                <a href="/chatrooms" aria-label="Toggle navigation">채팅</a>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* navbar collapse */}
                                    <div className="login-button">
                                        <ul>
                                            {token ? (
                                                <>
                                                    <li>
                                                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}><i className="lni lni-exit"></i>로그아웃</a>
                                                    </li>
                                                    <li>
                                                        <a href="/mypage"><i className="lni lni-user"></i>마이 페이지</a>
                                                    </li>
                                                </>
                                            ) : (
                                                <>
                                                    <li>
                                                        <a href="/login"><i className="lni lni-enter"></i>로그인</a>
                                                    </li>
                                                    <li>
                                                        <a href="/signup"><i className="lni lni-user"></i>회원가입</a>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </nav>
                                {/* navbar */}
                            </div>
                        </div>
                    </div>
                    {/* row */}
                </div>
                {/* container */}
            </header>
            {/* End Header Area */}
        </div>
    );
};

export default Header;
