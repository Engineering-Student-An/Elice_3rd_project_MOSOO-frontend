import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo/logo.png"; // Header.js의 위치에 따라 경로 조정

const Header = () => {
  const [token, setToken] = useState(localStorage.getItem("token")); // 로컬 스토리지에서 토큰 가져오기

  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    setToken(null); // 상태 업데이트
    window.location.href = "/"; // 메인 페이지로 이동
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token")); // 스토리지 변경 시 상태 업데이트
    };

    window.addEventListener("storage", handleStorageChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      {/* Header Area */}
      <header
        className="header navbar-area"
        style={{
          borderBottom: "1px solid #EEEEEE",
          height: "100px",
          position: "sticky",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="nav-inner">
                <nav
                  className="navbar navbar-expand-lg"
                  style={{ height: "95px" }}
                >
                  <a className="navbar-brand" href="/">
                    <img src={logo} style={{ width: "130px" }} alt="Logo" />
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
                  <div
                    className="collapse navbar-collapse sub-menu-bar"
                    id="navbarSupportedContent"
                  >
                    <ul id="nav" className="navbar-nav d-flex ms-auto">
                      <li className="nav-item">
                        <a href="/offerPosts" aria-label="Toggle navigation">
                          고수 제공 목록
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="/requestPosts" aria-label="Toggle navigation">
                          도움 요청 목록
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="/TechProvide" aria-label="Toggle navigation">
                          고수 등록/수정
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="/usages" aria-label="Toggle navigation">
                          이용내역
                        </a>
                      </li>
                      <li className="nav-item ms-auto">
                        <a href="/chatrooms" aria-label="Toggle navigation">
                          채팅
                        </a>
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
                      {token ? (
                        <>
                          <li>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                              }}
                            >
                              <i className="lni lni-exit"></i>로그아웃
                            </a>
                          </li>
                          <li>
                            <a href="/mypage">
                              <i className="lni lni-user"></i>마이 페이지
                            </a>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <a href="/login">
                              <i className="lni lni-enter"></i>로그인
                            </a>
                          </li>
                          <li>
                            <a href="/signup">
                              <i className="lni lni-user"></i>회원가입
                            </a>
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

