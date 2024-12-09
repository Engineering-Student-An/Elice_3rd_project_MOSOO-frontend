import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 게시글 목록 가져오기
 * @param {number} page - 요청할 페이지 번호
 * @param {boolean} isOffer - 요청 유형 (true: 고수, false: 일반)
 * @returns {Promise<Object>} - 게시글 데이터 { postList, totalPages }
 */
export const fetchPostList = async (page = 1, isOffer) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/post`, {
            params: { page, isOffer },
        });
        return response.data;
    } catch (error) {
        console.error('게시글 목록을 가져오는 데 실패했습니다.', error);
        throw new Error('게시글 목록을 가져오는 데 실패했습니다.');
    }
};

/**
 * 게시글 상세 가져오기
 * @param {string} postId - 게시글 ID
 * @returns {Promise<Object>} - 게시글 데이터
 */
export const fetchPostDetail = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error('게시글을 불러오는 데 실패했습니다.', error);
        throw new Error('게시글을 불러오는 데 실패했습니다.');
    }
};

/**
 * 게시글 삭제
 * @param {string} postId - 삭제할 게시글 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error('게시글 삭제에 실패했습니다.', error);
        throw new Error('게시글 삭제에 실패했습니다.');
    }
};

/**
 * 입찰 목록 가져오기
 * @param {string} postId - 게시글 ID
 * @returns {Promise<Array>} - 입찰 목록
 */
export const fetchBids = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/bid/${postId}`, { withCredentials: true });
        return response.data.bids;
    } catch (error) {
        console.error('입찰 데이터를 가져오는 데 실패했습니다.', error);
        throw new Error('입찰 데이터를 가져오는 데 실패했습니다.');
    }
};

/**
 * 입찰 생성하기
 * @param {string} postId - 게시글 ID
 * @param {Object} requestDto - 입찰 데이터
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} - 생성된 입찰 데이터
 */
export const createBid = async (postId, requestDto, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/bid/${postId}`, requestDto, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error('입찰 생성에 실패했습니다.', error);
        throw new Error('입찰 생성에 실패했습니다.');
    }
};

/**
 * 리뷰 목록 가져오기
 * @param {string} postId - 게시글 ID
 * @returns {Promise<Array>} - 리뷰 목록
 */
export const fetchReviews = async (postId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/review/${postId}`);
        return response.data.reviews;
    } catch (error) {
        console.error('리뷰 데이터를 가져오는 데 실패했습니다.', error);
        throw new Error('리뷰 데이터를 가져오는 데 실패했습니다.');
    }
};
