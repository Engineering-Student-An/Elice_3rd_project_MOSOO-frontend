import axios from 'axios';

/**
 * 게시글 목록 가져오기
 * @param {number} page - 요청할 페이지 번호
 * @param {boolean} isOffer - 요청 유형 (true: 고수, false: 일반)
 * @returns {Promise<Object>} - 게시글 데이터
 */
export const fetchPostList = async (page = 1, isOffer) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/post`, {
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

export const fetchPostDetail = async (postId) => {
    try {
        console.log(postId);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/post/${postId}`);
        return response.data;
    } catch (error) {
        throw new Error('게시글을 불러오는 데 실패했습니다.');
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/post/${postId}`);
        return response.data; // 성공적으로 삭제된 경우 응답 데이터 반환
    } catch (error) {
        throw new Error('게시글 삭제에 실패했습니다.');
    }
};

export const fetchBids = async (postId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bid/${postId}`, { withCredentials: true });
        return response.data;  // BidListResponseDto 반환
    } catch (err) {
        console.error('입찰 데이터 조회 실패:', err);
        throw err;
    }
};

// 입찰 생성하기
export const createBid = async (postId, requestDto, userId) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/bid/${postId}`, requestDto, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error('입찰 생성에 실패했습니다.', error);
        throw error;
    }
};