// src/pages/user/login-signup/AuthHandler.js
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthHandler = () => {
    useEffect(() => {
        const hash = window.location.hash;

        // 해시가 없으면 인증이 취소된 것으로 간주
        if (!hash) {
            alert('로그인 과정이 취소되었습니다.');
            window.location.href = '/signup'; // 회원가입 페이지로 리다이렉트
            return;
        }

        // URL에 error 파라미터가 포함되어 있는지 확인
        const params = new URLSearchParams(window.location.search);
        if (params.has('error')) {
            const error = params.get('error');
            if (error === 'access_denied') {
                alert('로그인 과정이 취소되었습니다. 다시 시도해주세요.');
                window.location.href = 'localhost:3000/signup'; // 회원가입 페이지로 리다이렉트
                return;
            }
        }

        const token = hash.split('&')[0].split('=')[1]; // 'access_token' 추출
        if (token) {
            Cookies.set('token', token, { expires: 7 }); // 7일 후 만료
            window.location.href = '/'; // 대시보드 페이지로 리다이렉트
        } else {
            alert('로그인에 실패했습니다.');
            window.location.href = '/signup'; // 회원가입 페이지로 리다이렉트
        }
    }, []);

    return <div>로그인 처리 중...</div>;
};

export default AuthHandler;
