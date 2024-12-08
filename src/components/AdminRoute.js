import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 이름으로 가져오기

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    const isAdmin = () => {
        if (!token) return false;

        try {
            const decoded = jwtDecode(token); // jwtDecode 사용
            return decoded.auth === 'ROLE_ADMIN'; // 'auth' 클레임이 'ROLE_ADMIN'인지 확인
        } catch (error) {
            console.error('토큰 디코딩 오류:', error);
            return false;
        }
    };

    if (!token) {
        return <Navigate to="/login" />; // 토큰이 없으면 로그인 페이지로 리디렉션
    }

    if (!isAdmin()) {
        return <Navigate to="/access-denied" />; // 토큰은 있지만 권한이 없으면 접근 거부 페이지로 리디렉션
    }

    return (
        <div>
            {children} {/* 관리자 권한이 있는 경우 자식 컴포넌트 렌더링 */}
        </div>
    );
};

export default AdminRoute;
