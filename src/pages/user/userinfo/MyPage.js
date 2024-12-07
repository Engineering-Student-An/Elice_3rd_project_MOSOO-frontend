import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './MyPage.css'; // CSS 파일에서 아이콘 스타일 추가

const MyPage = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    address: '',
    password: '',
    currentPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState(user);
  const [error, setError] = useState('');
  const [activeMenu, setActiveMenu] = useState('info');
  const [userRole, setUserRole] = useState('ROLE_USER'); // 사용자 역할 상태

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('YOUR_API_ENDPOINT_HERE/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const { fullName, email, address, role } = response.data; // 역할도 포함
          setUser({
            fullName: fullName || '',
            email: email || '',
            address: address || '',
            password: '',
            currentPassword: '',
          });
          setNewUser({
            fullName: fullName || '',
            email: email || '',
            address: address || '',
            password: '',
            currentPassword: '',
          });
          setUserRole(role); // 사용자 역할 설정
        } catch (error) {
          console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
          setError('사용자 정보를 가져오는 데 오류가 발생했습니다.');
        }
      } else {
        setError('토큰이 존재하지 않습니다.');
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    if (name === 'fullName') {
      setError('');
    }
  };

  const handleSave = () => {
    if (!newUser.fullName || newUser.fullName.length < 2 || newUser.fullName.length > 20) {
      setError('이름은 2글자 이상 20글자 이하로 입력해야 합니다.');
      return;
    }
    setError('');
    setUser(newUser);
    setIsEditing(false);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="my-page">
      <div className="my-page-sidebar">
        <div className="my-page-profile">
          <p>{user.fullName}</p>
          <p>@{user.email.split('@')[0]}</p>
        </div>
        <div className="my-page-menu">
          <button className={`my-page-menu-button ${activeMenu === 'info' ? 'active' : ''}`} onClick={() => handleMenuClick('info')}>
            <i className="fas fa-user-edit"></i> 내정보 수정
          </button>
          <button className={`my-page-menu-button ${activeMenu === 'history' ? 'active' : ''}`} onClick={() => handleMenuClick('history')}>
            <i className="fas fa-bookmark"></i> 이용 기록
          </button>
          <button className={`my-page-menu-button ${activeMenu === 'chat' ? 'active' : ''}`} onClick={() => handleMenuClick('chat')}>
            <i className="fas fa-comments"></i> 채팅 기록
          </button>
          <button className={`my-page-menu-button ${activeMenu === 'techInfo' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('techInfo')}
                  disabled={userRole === 'ROLE_USER'} // ROLE_USER일 경우 비활성화
                  style={{ opacity: userRole === 'ROLE_USER' ? 0.5 : 1 }}>
            <i className="fas fa-laptop-code"></i> 기술 제공 정보
          </button>
          <button className={`my-page-menu-button ${activeMenu === 'techHistory' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('techHistory')}
                  disabled={userRole === 'ROLE_USER'} // ROLE_USER일 경우 비활성화
                  style={{ opacity: userRole === 'ROLE_USER' ? 0.5 : 1 }}>
            <i className="fas fa-history"></i> 기술 제공 기록
          </button>
        </div>
      </div>

      <div className="my-page-content">
        {activeMenu === 'info' && (
          <div className="my-page-info-section">
            <h2>내정보 수정</h2>
            {isEditing ? (
              <div>
                <label>이름 *</label>
                <input
                  type="text"
                  name="fullName"
                  value={newUser.fullName}
                  onChange={handleChange}
                />
                <p className={`my-page-message ${error ? 'my-page-error' : 'my-page-warning'}`}>
                  {error || '이름은 2글자 이상 20글자 이하로 입력해야 합니다.'}
                </p>
                <label>이메일 *</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  readOnly
                />
                <label>사용자 주소</label>
                <input
                  type="text"
                  name="address"
                  value={newUser.address}
                  onChange={handleChange}
                />
                <div className="my-page-button-group">
                  <button className="my-page-action-button" onClick={handleSave}>
                    프로필 수정
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>이름: {user.fullName}</p>
                <p>이메일: {user.email}</p>
                <p>주소: {user.address}</p>
                <div className="my-page-button-group">
                  <button className="my-page-action-button" onClick={handleEditToggle}>
                    수정
                  </button>
                  <button className="my-page-request-button">기술 제공 전환</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'history' && (
          <div>
            <h2>이용 기록</h2>
            <p>이용 기록 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeMenu === 'chat' && (
          <div>
            <h2>채팅 기록</h2>
            <p>채팅 기록 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeMenu === 'techInfo' && (
          <div>
            <h2>기술 제공 정보</h2>
            <p>기술 제공 정보 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeMenu === 'techHistory' && (
          <div>
            <h2>기술 제공 기록</h2>
            <p>기술 제공 기록 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {activeMenu === 'info' && (
          <div className="my-page-password-section">
            <h3>비밀번호 수정</h3>
            <label>현재 비밀번호</label>
            <input
              type="password"
              name="currentPassword"
              value={newUser.currentPassword}
              onChange={handleChange}
            />
            <label>새 비밀번호</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
            />
            <div className="my-page-button-group">
              <button className="my-page-action-button">비밀번호 수정</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
