import React, {useEffect, useState} from "react";
import axios from "axios";

const OpponentInfo = ({chatRoomId}) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchInfos();
    }, []);

    const fetchInfos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/chatroom/${chatRoomId}/user-info`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    withCredentials: true
                }
            );
            setOpponent(response.data);
            setLoading(false); // 데이터 로드 완료
        } catch (err) {
            setErrorMessage(err.response ? err.response.data.message : err.message);
            console.error('Failed to load infos:', err);
            setLoading(false); // 데이터 로드 완료
        }
    };

    // 에러 발생 시
    if (errorMessage) {
        return <div> {errorMessage} </div>;
    }

    // 로딩 중일 때
    if (loading) {
        return <div>로딩 중...</div>; // 로딩 상태 표시
    }

    return (
        <div>
            {opponent.opponentGosu ? (
                <div>
                    <h5>사업자 명 </h5>
                    <p>{opponent.businessName}</p>

                    <h5 className="mt-4">사업자 번호</h5>
                    <p>{opponent.businessNumber}</p>

                    <h5 className="mt-4">기술 제공 주소</h5>
                    <p>{opponent.gosuInfoAddress}</p>

                    <h5 className="mt-4">기술 제공 카테고리</h5>
                    <p>{opponent.categoryName}</p>

                    <h5 className="mt-4">전화번호</h5>
                    <p>{opponent.gosuInfoPhone}</p>
                </div>
            ) : (
                <div>
                    <h5>이름</h5>
                    <p>{opponent.fullName}</p>

                    <h5 className="mt-4">이메일</h5>
                    <p>{opponent.email}</p>
                </div>
            )}
        </div>
    );

};

export default OpponentInfo;