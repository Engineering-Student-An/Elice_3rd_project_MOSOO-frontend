import React from 'react';
import { Link } from 'react-router-dom'; // React Router 사용 시 Link 컴포넌트
import './MyMenu.css'; // CSS 파일을 별도로 추가

const MyMenu = () => {
  return (
    <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
      <ul id="nav" className="navbar-nav d-flex ms-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link" aria-label="Toggle navigation">
            <i className="fas fa-home"></i> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/bidding" className="nav-link" aria-label="Toggle navigation">
            <i className="fas fa-gavel"></i> 입찰페이지
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/payment" className="nav-link" aria-label="Toggle navigation">
            <i className="fas fa-credit-card"></i> 결제하기
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/history" className="nav-link" aria-label="Toggle navigation">
            <i className="fas fa-history"></i> 이용내역
          </Link>
        </li>
        <li className="nav-item ms-auto">
          <Link to="/chatrooms" className="nav-link" aria-label="Toggle navigation">
            <i className="fas fa-comments"></i> 채팅
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MyMenu;
