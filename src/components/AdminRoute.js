import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from './IsAdmin'; // isAdmin 함수 import

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");

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
