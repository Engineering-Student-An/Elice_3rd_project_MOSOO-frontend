import React, { useState, useEffect } from 'react';
import { fetchMyBids } from './MyBidsApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBids = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchMyBids();
                setBids(data.bids);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBids();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="purple-text mb-4">내 입찰 목록</h2>

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-danger">{error}</p>}

            {bids.length > 0 ? (
                <table className="table table-bordered">
                    <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>가격</th>
                        <th>날짜</th>
                        <th>회원 이름</th>
                        <th>회원 ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bids.map((bid) => (
                        <tr key={bid.id}>
                            <td>{bid.id}</td>
                            <td>{bid.price.toLocaleString()} 원</td>
                            <td>{new Date(bid.date).toLocaleString()}</td>
                            <td>{bid.fullName}</td>
                            <td>{bid.userId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>입찰 정보가 없습니다.</p>
            )}
        </div>
    );
};

export default MyBids;
