import React, {useEffect, useState} from "react";
import axios from "axios";

const OpponentInfo = ({chatRoomId}) => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setError(err);
            console.error('Failed to load infos:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                Error loading infos: {error.response ? error.response.data.message : error.message}
            </div>
        );
    }

    return (
        <div>
            <h1>{opponent}</h1>
        </div>
    );

};

export default OpponentInfo;