import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 전체 게시글 조회 API 호출
 * @param {number} page - 요청할 페이지 번호
 * @returns {Promise<Object>} - 페이지네이션된 게시글 데이터
 */
export const getAllPosts = async (page) => {
    try {
        const token = localStorage.getItem('token'); // 토큰 가져오기
        const response = await axios.get(`${API_BASE_URL}/api/posts`, {
            params: { page },
            headers: {
                Authorization: `Bearer ${token}`, // 인증 헤더 추가
            },
        });
        return response.data; // 서버에서 반환된 데이터
    } catch (error) {
        console.error('전체 게시글 조회 실패:', error);
        throw new Error('전체 게시글 조회에 실패했습니다.');
    }
};
