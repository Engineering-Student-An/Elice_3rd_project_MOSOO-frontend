import React, { useEffect, useState } from 'react';

import './UsageList.css';
import '../../components/button.css';

const PaymentComplete = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOngoingServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ongoing-services`); // 서버의 API 엔드포인트
            if (!response.ok) throw new Error('진행 네트워크 응답이 좋지 않습니다.');
            const data = await response.json();
            setServices(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompletedServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/completed-services`); // 서버의 API 엔드포인트
            if (!response.ok) throw new Error('완료 네트워크 응답이 좋지 않습니다.');
            const data = await response.json();
            setServices(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 서비스 완료 버튼 클릭 시 -> 수정 -> fetchCompletedServices 호출

    useEffect(() => {
        fetchOngoingServices(); // 컴포넌트가 마운트될 때 진행 서비스 목록을 가져옴
    }, []); // 빈 배열을 두 번째 인자로 주어, 컴포넌트가 처음 렌더링될 때만 호출됨

    return (
        <div className="usage-container">
            <div style={{ position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '99' }}>
                <h2>이용내역</h2>
                <hr />
            </div>

            <div style={{ margin: '20px 0' }}>
                <button className="btn btn-light me-10" onClick={fetchOngoingServices}>진행 서비스</button>
                <button className="btn btn-light" onClick={fetchCompletedServices}>완료 서비스</button>
            </div>

            {loading && <p>로딩 중...</p>} {/* 로딩 중일 때 표시 */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="usage-card-container">
                {[        { name: '서비스 1', description: '서비스 1 설명' },        { name: '서비스 2', description: '서비스 2 설명' },        { name: '서비스 3', description: '서비스 3 설명' },        { name: '서비스 4', description: '서비스 4 설명' },    ].map((service, index) => (
                    <div className="usage-card" key={index}>
                        <p>{service.name}</p>
                        <p>{service.description}</p>

                        <button className="purple-button mt-10">서비스 완료</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentComplete;
