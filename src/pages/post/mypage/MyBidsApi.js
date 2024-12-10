import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetch My Bids
 * @returns {Promise<{ bids: Array<Object> }>} - The response data containing bids
 */
export const fetchMyBids = async () => {
    const token = localStorage.getItem('token'); // 인증 토큰 가져오기

    if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인하세요.');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/bid/myBid`, {
            headers: {
                Authorization: `Bearer ${token}`, // 토큰 헤더 추가
            },
        });

        return response.data; // bids 배열 반환
    } catch (error) {
        console.error('Error fetching my bids:', error);

        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message); // 서버 에러 메시지 반환
        }

        throw new Error('내 입찰 목록을 가져오는 데 실패했습니다.');
    }
};
