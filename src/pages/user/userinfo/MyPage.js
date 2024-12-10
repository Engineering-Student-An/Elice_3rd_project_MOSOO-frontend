import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../../../components/IsAdmin'; // isAdmin 함수 import
import './MyPage.css';
import UsageList from "../../usage/UsageList";
import {ChatRoomList} from "../../chatting";
import AdminUserLIst from "../../admin/AdminUserLIst";
import {CategoryList} from "../../category";
import {MyPosts} from "../../post/mypage";
import MyReviews from "../../post/mypage/MyReviews"; // CSS 파일에서 아이콘 스타일 추가

const MyPage = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    address: '',
    password: '',
    currentPassword: '',
     userInfoId: '', // userInfoId 추가
     authority: ''
  });

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState(user);
  const [error, setError] = useState('');
  const [activeMenu, setActiveMenu] = useState('info');
  const [userRole, setUserRole] = useState(''); // 사용자 역할 상태
  const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('User data response:', response.data); // 응답 확인
          const { fullName, email, userInfoId, authority} = response.data; // 역할도 포함
          setUserRole(response.data.authority);
          const address = response.data.userInfoDto.address;
          setUser({
            fullName: fullName || '',
            email: email || '',
            address: address || '',
            password: '',
            currentPassword: '',
            userInfoId: userInfoId || '', // userInfoId 설정
            authority: authority || ''

          });
          setNewUser({
            fullName: fullName || '',
            email: email || '',
            address: address || '',
            password: '',
            userInfoId: userInfoId || '', // userInfoId 설정
            authority: authority || ''
          });
          console.log(address);
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

  const handleSave = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/user/userinfo`, {
              email: user.email, // 현재 사용자 이메일
              newAddress: newUser.address // 새로운 주소
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
              }
          });

          if (response.status === 200) {
              alert('프로필이 성공적으로 수정되었습니다.');
              setUser(newUser);
              setIsEditing(false);
              window.location.href = '/mypage';
          }
      } catch (error) {
          console.error('프로필 수정 중 오류가 발생했습니다:', error);
          setError('프로필 수정 중 오류가 발생했습니다.');
      }
  };




  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };


    const handleTechProvideTransition = () => {
      navigate('/TechProvide'); // 기술 제공 페이지로 이동
    };

  const handlePasswordChange = async () => {
      setPasswordError('');
      if (!newUser.exPassword) { // 변경된 필드명
          setPasswordError('현재 비밀번호를 입력하세요.');
          return;
      }

      if (!newUser.newPassword) { // 변경된 필드명
          setPasswordError('새 비밀번호를 입력하세요.');
          return;
      }

      if (newUser.newPassword !== confirmPassword) { // 변경된 필드명
          setPasswordError('새 비밀번호가 일치하지 않습니다.');
          return;
      } else {
        if (newUser.newPassword == newUser.exPassword) {
        setPasswordError('기존 비밀번호와 똑같은 비밀번호 입니다.')
        return;
        }
      }

      try {
          const token = localStorage.getItem('token');
          const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/user/password`, {
              email: user.email, // 이메일 추가
              exPassword: newUser.exPassword, // 변경된 필드명
              newPassword: newUser.newPassword, // 변경된 필드명
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          if (response.status === 200) {
              alert('비밀번호가 성공적으로 변경되었습니다.');
              // 비밀번호 변경 후 필드 초기화
              setNewUser({ ...newUser, exPassword: '', newPassword: '' }); // 변경된 필드명
              setConfirmPassword('');
          }
      } catch (error) {
          console.error('비밀번호 변경 중 오류가 발생했습니다:', error);
          setPasswordError('현재 비밀번호가 일치하지 않습니다.');
      }
  };

  const handleTechWithdrawal = async () => {
          const token = localStorage.getItem('token');
          try {
              const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/gosu`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              if (response.status === 200) {
                  alert('기술 제공이 성공적으로 탈퇴되었습니다.');
                  window.location.href = '/mypage'; // 마이 페이지로 이동
              }
          } catch (error) {
              console.error('기술 제공 탈퇴 중 오류가 발생했습니다:', error);
              alert('기술 제공 탈퇴 중 오류가 발생했습니다.');
          }
      };


  return (
    <div className="my-page">
      <div className="my-page-sidebar">
        <div className="my-page-profile">
          <p>{user.fullName}</p>
          <p>@{user.email.split('@')[0]}</p>
        </div>
          <div className="my-page-menu">
              <button className={`my-page-menu-button ${activeMenu === 'info' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('info')}>
                  <i className="fas fa-user-edit"></i> 내정보 수정
              </button>
              <button className={`my-page-menu-button ${activeMenu === 'post' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('post')}>
                  <i className="fas fa-user-edit"></i> 게시글 내역
              </button>
              <button className={`my-page-menu-button ${activeMenu === 'review' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('review')}>
                  <i className="fas fa-user-edit"></i> 리뷰 내역
              </button>
              <button className={`my-page-menu-button ${activeMenu === 'history' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('history')}>
                  <i className="fas fa-bookmark"></i> 이용 내역
              </button>
              <button className={`my-page-menu-button ${activeMenu === 'chat' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('chat')}>
                  <i className="fas fa-comments"></i> 채팅 내역
              </button>
              <button className={`my-page-menu-button ${activeMenu === 'bid' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('bid')}
                      disabled={userRole !== 'ROLE_GOSU'} // ROLE_GOSU일 경우만 활성화
                      style={{opacity: userRole !== 'ROLE_GOSU' ? 0.5 : 1}}>
                  <i className="fas fa-user-edit"></i> 입찰 내역
              </button>
              <button
                  className={`my-page-menu-button ${activeMenu === 'techInfo' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('techInfo')}
                  disabled={userRole !== 'ROLE_GOSU'} // ROLE_GOSU일 경우만 활성화
                  style={{opacity: userRole !== 'ROLE_GOSU' ? 0.5 : 1}}>
                  <i className="fas fa-laptop-code"></i> 기술 제공 정보
              </button>
              <button
                  className={`my-page-menu-button ${activeMenu === 'techHistory' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('techHistory')}
                  disabled={userRole !== 'ROLE_GOSU'} // ROLE_GOSU일 경우만 활성화
                  style={{opacity: userRole !== 'ROLE_GOSU' ? 0.5 : 1}}>
                  <i className="fas fa-history"></i> 기술 제공 기록
              </button>
              {/* Admin 버튼 추가 */}
              {isAdmin() && (
                  <div className="my-page-menu">

                      <button
                          className={`my-page-menu-button ${activeMenu === 'userManagement' ? 'active' : ''}`}
                          onClick={() => handleMenuClick('userManagement')}>
                          <i className="fas fa-users"></i>(관리자) 회원 관리
                      </button>

                      <button
                          className={`my-page-menu-button ${activeMenu === 'categoryManagement' ? 'active' : ''}`}
                          onClick={() => handleMenuClick('categoryManagement')}>
                          <i className="fas fa-tags"></i>(관리자) 카테고리 관리
                      </button>

                      <button
                          className={`my-page-menu-button ${activeMenu === 'postManagement' ? 'active' : ''}`}
                          onClick={() => handleMenuClick('postManagement')}>
                          <i className="fas fa-file-alt"></i>(관리자) 게시글 관리
                      </button>
                  </div>
              )}

          </div>
      </div>

        <div className="my-page-content">
            {activeMenu === 'info' && (
                <div className="my-page-info-section">
                    <h2>내정보 수정</h2>
                    {isEditing ? (
                        <div>
                <label className = "my-page-label">이름 *</label>
                <input
                  className = "my-page-input"
                  type="text"
                  name="fullName"
                  value={newUser.fullName}
                  onChange={handleChange}
                  readOnly
                />
                <p className={`my-page-message ${error ? 'my-page-error' : 'my-page-warning'}`}>
                  {error || '이름은 2글자 이상 20글자 이하로 입력해야 합니다.'}
                </p>
                <label className = "my-page-label">이메일 *</label>
                <input
                  className = "my-page-input"
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  readOnly
                />
                <label className = "my-page-label">사용자 주소</label>
                <input
                  className = "my-page-input"
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
                  {userRole === 'ROLE_GOSU' ? (
                    <button className="my-page-request-button" onClick={handleTechWithdrawal}>
                      기술 제공 탈퇴
                    </button>
                  ) : (
                    <button className="my-page-request-button" onClick={handleTechProvideTransition}>
                      기술 제공 전환
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeMenu === 'post' && (
            <div>
                <MyPosts></MyPosts>
            </div>
        )}

        {activeMenu === 'review' && (
            <div>
                <MyReviews></MyReviews>
            </div>
        )}

        {activeMenu === 'history' && (
          <div>
            <UsageList></UsageList>
          </div>
        )}

        {activeMenu === 'chat' && (
          <div>
            <ChatRoomList></ChatRoomList>
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
                <label className="my-page-label">현재 비밀번호</label>
                <input
                    className="my-page-input"
                    type="password"
                    name="exPassword" // 변경된 필드명
                    value={newUser.exPassword} // 변경된 필드명
                    onChange={handleChange}
                />
                <label className="my-page-label">새 비밀번호</label>
                <input
                    className="my-page-input"
                    type="password"
                    name="newPassword" // 변경된 필드명
                    value={newUser.newPassword} // 변경된 필드명
                    onChange={handleChange}
                />
                <label className="my-page-label">새 비밀번호 확인</label>
                <input
                    className="my-page-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <p className={`my-page-message ${passwordError ? 'my-page-error' : ''}`}>
                    {passwordError}
                </p>
                <div className="my-page-button-group">
                    <button className="my-page-action-button" onClick={handlePasswordChange}>
                        비밀번호 수정
                    </button>
                </div>
            </div>
        )}



        {activeMenu === 'userManagement' && (
            <AdminUserLIst></AdminUserLIst>
        )}

        {activeMenu === 'categoryManagement' && (
            <CategoryList></CategoryList>
        )}

        {activeMenu === 'postManagement' && (
            <div>
              <h3>게시글 관리</h3>
              <p>게시글 관리 넣어주세요.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
