import axios from 'axios';

// 대분류 카테고리 가져오기
export const fetchCategories = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/category/firstCategory`
        );
        return response.data;
    } catch (err) {
        console.error('대분류 불러오기 실패:', err);
        throw new Error('대분류를 불러오는 데 실패했습니다.');
    }
};

// 중분류 카테고리 가져오기
export const fetchSubCategoriesLevel1 = async (parentCategoryId) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/category/${parentCategoryId}`
        );
        return response.data;
    } catch (err) {
        console.error('중분류 불러오기 실패:', err);
        throw new Error('중분류를 불러오는 데 실패했습니다.');
    }
};

// 하분류 카테고리 가져오기
export const fetchSubCategoriesLevel2 = async (subCategory1Id) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/category/${subCategory1Id}`
        );
        return response.data;
    } catch (err) {
        console.error('하분류 불러오기 실패:', err);
        throw new Error('하분류를 불러오는 데 실패했습니다.');
    }
};

// 게시글 생성
export const createPost = async (formData) => {
    try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/post`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error('게시글 생성 실패:', err);
        throw new Error('게시글 생성에 실패했습니다.');
    }
};

