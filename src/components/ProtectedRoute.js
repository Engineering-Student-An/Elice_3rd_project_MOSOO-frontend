import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie'; // js-cookie 라이브러리 사용

axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // 초기값 null
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/auth/token`,
                    {
                        params: { accessToken: token }
                    }
                );

                // 요청이 성공적이라면
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    // POST 요청으로 토큰 재발급 시도
                    await refreshAuthToken();
                }
            } catch (error) {
                console.error("인증 체크 실패:", error);
                // POST 요청으로 토큰 재발급 시도
                await refreshAuthToken();
            }
        };

        checkAuth();
    }, [token]);

    const refreshAuthToken = async () => {
        try {

            const refreshToken = Cookies.get('refreshToken'); // 쿠키에서 refreshToken 가져오기
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/token`
            );

            if (response.status === 201) {
                localStorage.setItem("token", response.data.accessToken);
                setIsAuthenticated(true); // 인증 상태 업데이트
            }
        } catch (error) {
            console.error("토큰 재발급 실패:", error);
            setIsAuthenticated(false); // 인증 실패 상태 설정
        }
    };

    // 로딩 상태를 확인
    if (isAuthenticated === null) {
        return <div>로딩 중...</div>; // 로딩 상태 표시
    }

    return (
        <div>
            {isAuthenticated ? children : <Navigate to="/login" />}
        </div>
    );
};

export default ProtectedRoute;
