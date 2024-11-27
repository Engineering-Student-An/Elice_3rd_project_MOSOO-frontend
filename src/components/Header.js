import React from 'react';

const Header = () => {
    return (
        <div>
            {/* Header Area */}
            <header className="header navbar-area" style={{borderBottom: '1px solid #EEEEEE', height: '100px', position: 'sticky'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="nav-inner">
                                <nav className="navbar navbar-expand-lg" style={{height: '95px'}}>
                                    <a className="navbar-brand" href="">
                                        <img src="/assets/images/logo/logo.png" style={{width:'130px'}} alt="Logo" />
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
                                                <a href="javascript:void(0)"
                                                   aria-label="Toggle navigation">Home</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="javascript:void(0)"
                                                   aria-label="Toggle navigation">입찰페이지</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="javascript:void(0)"
                                                   aria-label="Toggle navigation">결제하기</a>
                                            </li>
                                            <li className="nav-item">
                                                <a href="javascript:void(0)"
                                                   aria-label="Toggle navigation">이용내역</a>
                                            </li>
                                            <li className="nav-item ms-auto"> {/* 여기에서 ms-auto 사용 */}
                                                <a href="javascript:void(0)" aria-label="Toggle navigation">채팅</a>
                                            </li>
                                            {/*<li className="nav-item">*/}
                                            {/*    <a*/}
                                            {/*        className="dd-menu collapsed"*/}
                                            {/*        href="javascript:void(0)"*/}
                                            {/*        data-bs-toggle="collapse"*/}
                                            {/*        data-bs-target="#submenu-1-3"*/}
                                            {/*        aria-controls="navbarSupportedContent"*/}
                                            {/*        aria-expanded="false"*/}
                                            {/*        aria-label="Toggle navigation"*/}
                                            {/*    >*/}
                                            {/*        Listings*/}
                                            {/*    </a>*/}
                                            {/*    <ul className="sub-menu collapse" id="submenu-1-3">*/}
                                            {/*        <li className="nav-item"><a href="javascript:void(0)">Ad Grid</a>*/}
                                            {/*        </li>*/}
                                            {/*        <li className="nav-item"><a href="javascript:void(0)">Ad Listing</a>*/}
                                            {/*        </li>*/}
                                            {/*        <li className="nav-item"><a href="javascript:void(0)">Ad Details</a>*/}
                                            {/*        </li>*/}
                                            {/*    </ul>*/}
                                            {/*</li>*/}
                                            {/*<li className="nav-item">*/}
                                            {/*    <a*/}
                                            {/*        className="dd-menu collapsed"*/}
                                            {/*        href="javascript:void(0)"*/}
                                            {/*        data-bs-toggle="collapse"*/}
                                            {/*        data-bs-target="#submenu-1-4"*/}
                                            {/*        aria-controls="navbarSupportedContent"*/}
                                            {/*        aria-expanded="false"*/}
                                            {/*        aria-label="Toggle navigation"*/}
                                            {/*    >*/}
                                            {/*        Pages*/}
                                            {/*    </a>*/}
                                            {/*    <ul className="sub-menu mega-menu collapse" id="submenu-1-4">*/}
                                            {/*        <li className="single-block">*/}
                                            {/*            <ul>*/}
                                            {/*                <li className="mega-menu-title">Essential Pages</li>*/}
                                            {/*                <li className="nav-item"><a href="about-us.html">About*/}
                                            {/*                    Us</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Ads*/}
                                            {/*                    Details</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Ads*/}
                                            {/*                    Post</a></li>*/}
                                            {/*                <li className="nav-item"><a href="pricing.html">Pricing*/}
                                            {/*                    Table</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Sign*/}
                                            {/*                    Up</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Sign*/}
                                            {/*                    In</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Contact*/}
                                            {/*                    Us</a></li>*/}
                                            {/*                <li className="nav-item"><a*/}
                                            {/*                    href="javascript:void(0)">FAQ</a></li>*/}
                                            {/*                <li className="nav-item"><a href="404.html">Error Page</a>*/}
                                            {/*                </li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Mail*/}
                                            {/*                    Success</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Coming*/}
                                            {/*                    Soon</a></li>*/}
                                            {/*            </ul>*/}
                                            {/*        </li>*/}
                                            {/*        <li className="single-block">*/}
                                            {/*            <ul>*/}
                                            {/*                <li className="mega-menu-title">Dashboard</li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Account*/}
                                            {/*                    Overview</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">My*/}
                                            {/*                    Profile</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">My*/}
                                            {/*                    Ads</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Favorite*/}
                                            {/*                    Ads</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Ad*/}
                                            {/*                    post</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Bookmarked*/}
                                            {/*                    Ad</a></li>*/}
                                            {/*                <li className="nav-item"><a*/}
                                            {/*                    href="javascript:void(0)">Messages</a></li>*/}
                                            {/*                <li className="nav-item"><a href="javascript:void(0)">Close*/}
                                            {/*                    account</a></li>*/}
                                            {/*                <li className="nav-item"><a*/}
                                            {/*                    href="javascript:void(0)">Invoice</a></li>*/}
                                            {/*            </ul>*/}
                                            {/*        </li>*/}
                                            {/*    </ul>*/}
                                            {/*</li>*/}
                                        </ul>
                                    </div>
                                    {/* navbar collapse */}
                                    <div className="login-button">
                                        <ul>
                                        <li>
                                                <a href="javascript:void(0)"><i className="lni lni-enter"></i>로그인</a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)"><i className="lni lni-user"></i>회원가입</a>
                                            </li>
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
