import React, {useEffect, useState} from "react";
import axios from "axios";

const OpponentInfo = ({chatRoomId}) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [opponent, setOpponent] = useState(null);

    useEffect(() => {

        fetchInfos();
    }, []);

    // TODO: 유저 정보 dto 로 받아야 함 (지금은 opponentFullName)
    const fetchInfos = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chatroom/${chatRoomId}/user-info`);
            setOpponent(response.data.opponentFullName);
        } catch (err) {
            setErrorMessage(err.response ? err.response.data.message : err.message);
            console.error('Failed to load infos:', err);
        }
    };

    if (errorMessage) {
        return <div> {errorMessage} </div>;
    }

    return (
        <div>
            <h1>{opponent}</h1>
        </div>
    );

};

export default OpponentInfo;