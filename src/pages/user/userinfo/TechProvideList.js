import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const MyBids = () => {
    const [orders, setOrders] = useState([]); // 초기 상태는 빈 배열
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/orders/gosu`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        withCredentials: true
                        }
                );
                setOrders(response.data.orders);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="purple-text mb-4">기술 제공 기록</h3>

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-danger">{error}</p>}

            {orders.length > 0 ? (
                <table className="table table-bordered">
                    <thead className="thead-dark">
                    <tr>
                        <th>번호</th>
                        <th>회원 정보</th>
                        <th>진행 날짜</th>
                        <th>가격</th>
                        <th>결제 날짜</th>
                        <th>제공 상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>{order.userFullName} ({order.userEmail})</td>
                            <td>
                                {(() => {
                                const date = new Date(order.workDate);
                                // 유효한 날짜인지 확인
                                return !isNaN(date.getTime()) ? (
                                    date.toLocaleDateString("ko-KR") // 유효한 경우 한국 날짜 형식으로 출력
                                ) : (
                                    order.workDate // 유효하지 않은 경우 문자열 그대로 출력
                                );
                            })()}
                            </td>
                            <td>{order.price.toLocaleString()} 원</td>
                            <td>{new Date(order.paidAt).toLocaleDateString("ko-KR")}</td>
                            <td>{order.orderStatus === 'PAID' ? '제공 전' :
                                order.orderStatus === 'SERVICE_COMPLETED' ? '제공 완료' :
                                    order.orderStatus}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>기술 제공 기록이 없습니다.</p>
            )}
        </div>
    );
};

export default MyBids;
