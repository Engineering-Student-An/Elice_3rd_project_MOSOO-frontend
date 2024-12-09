import React, { useState } from 'react';
import './MyPage.css'; // 스타일을 위한 CSS 파일

const MyPage = () => {
  const [user, setUser] = useState({
    name: '현승',
    email: 'gustmd9694@gmail.com',
    address: '부산광역시 해운대구 우동',
    profileImage: 'testimage.jpg',
    password: '',
    currentPassword: '', // 현재 비밀번호 추가
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState(user);
  const [error, setError] = useState(''); // 초기 에러 상태 설정

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(''); // 편집 모드 전환 시 에러 초기화
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    // 이름 입력 시 에러 메시지 초기화
    if (name === 'name') {
      setError('');
    }
  };

  const handleSave = () => {
    // 유효성 검사
    if (!newUser.name || newUser.name.length < 2 || newUser.name.length > 20) {
      setError('이름은 2글자 이상 20글자 이하로 입력해야 합니다.');
      return;
    }
    setError(''); // 에러 메시지 초기화
    setUser(newUser);
    setIsEditing(false);
  };

  return (
    <div className="my-page">
      <div className="sidebar">
        <div className="profile">
          <img src={user.profileImage} alt="Profile" className="profile-image" />
          <p>{user.name}</p>
          <p>@{user.email.split('@')[0]}</p>
        </div>
        <ul className="menu">
          <li>내정보 수정</li>
          <li>이용 기록</li>
          <li>채팅 기록</li>
          <li>기술 제공 정보</li>
          <li>기술 제공 기록</li>
        </ul>
      </div>

      <div className="content">
        <div className="info-section">
          <h2>내정보 수정</h2>
          {isEditing ? (
            <div>
              <label>이름 *</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
              />
              <p className={`message ${error ? 'error' : 'warning'}`}>
                {error || '이름은 2글자 이상 20글자 이하로 입력해야 합니다.'}
              </p> {/* 경고 및 에러 메시지 표시 */}
              <label>이메일 *</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleChange}
                readOnly // 이메일 필드를 수정 불가능하게 설정
              />
              <label>프로필 사진</label>
              <input
                type="text"
                name="profileImage"
                value={newUser.profileImage}
                onChange={handleChange}
              />
              <label>사용자 주소</label>
              <input
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleChange}
              />
              <div className="button-group">
                <button className="action-button" onClick={handleSave}>
                  프로필 수정
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p>이름: {user.name}</p>
              <p>이메일: {user.email}</p>
              <p>프로필 사진: {user.profileImage}</p>
              <p>주소: {user.address}</p>
              <div className="button-group">
                <button className="action-button" onClick={handleEditToggle}>
                  수정
                </button>
                <button className="request-button">기술 제공 전환</button>
              </div>
            </div>
          )}
        </div>

        <div className="password-section">
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
          <div className="button-group">
            <button className="action-button">비밀번호 수정</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
