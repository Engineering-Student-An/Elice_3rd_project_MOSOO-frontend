import React, { useEffect, useState } from 'react';
import './UsageList.css';
import '../../components/button.css';
import axios from 'axios';

const PaymentComplete = () => {
    const [orders, setOrders] = useState([]); // 초기 상태는 빈 배열
    const [ongoing, setOngoing] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async (isOngoing) => {
        setError(null);
        const status = isOngoing ? 'PAID' : 'SERVICE_COMPLETED';
        setOngoing(isOngoing);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/order`, {
                params: { orderStatus: status },
                withCredentials: true
            });

            setOrders(response.data.orders);
            console.log(response.data.orders);

        } catch (err) {
            setError(err.message);
        }
    };

    const handleCompleteService = async (orderId) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/order/${orderId}`, {
                withCredentials: true
            });

            if(response.status === 201) {
                // 요청이 성공하면 상태를 다시 fetch
                fetchOrders(false);
            }
        } catch (err) {
            setError(err.message);
        }
    };


    useEffect(() => {
        fetchOrders(true); // 컴포넌트가 마운트될 때 진행 서비스 목록을 가져옴
    }, []);

    return (
        <div className="usage-container">
            <div style={{ position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '99' }}>
                <h2>이용내역</h2>
                <hr />
            </div>

            <div style={{ margin: '20px 0' }}>
                <button className={`${ongoing ? 'btn purple-button me-2' : 'btn gray-button me-2'}`} onClick={() => fetchOrders(true)}>진행 서비스</button>
                <button className={`${ongoing ? 'btn gray-button' : 'btn purple-button'}`} onClick={() => fetchOrders(false)}>완료 서비스</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="usage-card-container">
                {orders.map((order, index) => (
                    <div className="usage-card" key={index}>
                        <h5>{order.gosuName}</h5>
                        <hr/>
                        <p>진행날짜: {new Date(order.workDate).toLocaleDateString('ko-KR')}</p>
                        <p>금액: {order.price.toLocaleString()} 원</p>
                        <p>결제완료일자: {new Date(order.paidAt).toLocaleDateString('ko-KR')}</p>

                        {ongoing ? (
                            <button className="purple-button mt-10" onClick={() => handleCompleteService(order.orderId)}>
                                서비스 완료
                            </button>
                        ) : (
                            <a href={`/review/${order.postId}`} className="purple-button mt-10">리뷰쓰기</a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentComplete;
