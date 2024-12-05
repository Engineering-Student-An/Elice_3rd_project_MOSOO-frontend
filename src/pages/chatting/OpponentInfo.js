import React, {useEffect, useState} from "react";
import axios from "axios";

const OpponentInfo = ({chatRoomId}) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchInfos();
    }, []);

    // TODO: 유저 정보 dto 로 받아야 함 (지금은 opponentFullName)
    const fetchInfos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/chatroom/${chatRoomId}/user-info`,
                { withCredentials: true }
            );
            setOpponent(response.data.opponentFullName);
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
            <h1>{opponent}</h1>
        </div>
    );

};

export default OpponentInfo;