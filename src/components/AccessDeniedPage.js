import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDeniedPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/"); // 홈으로 리디렉션
    };

    return (
        <div style={{ textAlign: 'center', margin: '50px', marginTop: '200px'}}>
            <h1>관리자 페이지에 접근할 수 없습니다!</h1>
            <button onClick={handleGoHome} className="btn btn-outline-dark" style={{marginTop: '30px', padding: '10px 20px', fontSize: '16px' }}>
                홈으로 돌아가기
            </button>
        </div>
    );
};

export default AccessDeniedPage;
