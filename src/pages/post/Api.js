import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/post'; // 실제 API URL로 교체하세요

/**
 * 게시글 목록 가져오기
 * @param {number} page - 요청할 페이지 번호
 * @param {boolean} isOffer - 요청 유형 (true: 고수, false: 일반)
 * @returns {Promise<Object>} - 게시글 데이터
 */
export const fetchPostList = async (page = 1, isOffer = false) => {
    try {
        const response = await axios.get(`${API_BASE_URL}`, {
            params: {
                page, // 페이지 번호
                isOffer // 요청 유형
            },
        });
        return response.data; // { postList, totalPages }
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw new Error('게시글 목록을 가져오는 데 실패했습니다.');
    }
};
