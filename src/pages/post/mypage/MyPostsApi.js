import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetch My Posts
 * @param {number} page - The current page number
 * @returns {Promise<Object>} - The response data containing postList and totalPages
 */
export const fetchMyPosts = async (page = 1) => {
    const token = localStorage.getItem('token'); // LocalStorage에서 인증 토큰 가져오기

    if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인하세요.');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/post/myPosts`, {
            headers: {
                Authorization: `Bearer ${token}`, // 토큰 헤더 추가
            },
        });

        const { postList, totalPages } = response.data;

        if (!Array.isArray(postList) || typeof totalPages !== 'number') {
            throw new Error('응답 데이터 형식이 올바르지 않습니다.');
        }

        return {
            postList,
            totalPages,
        };
    } catch (error) {
        console.error('Error fetching my posts:', error);
        throw new Error('내 글 목록을 가져오는 데 실패했습니다.');
    }
};
