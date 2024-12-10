import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleTokenCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // URL 쿼리 파라미터에서 accessToken을 확인
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');

        if (accessToken) {
            // accessToken이 있으면 로컬 스토리지에 저장
            localStorage.setItem('token', accessToken);
            // 필요한 경우 특정 페이지로 리다이렉트
            navigate('/');
        }
    }, [navigate]);
};

export default GoogleTokenCheck;