import { jwtDecode } from 'jwt-decode';

export const getJwtSubject = () => {
    const token = localStorage.getItem("token");
    if (!token) return null; // 토큰이 없으면 null 반환

    try {
        const decoded = jwtDecode(token); // 토큰 디코딩
        return decoded.sub || null; // subject 값 반환, 없으면 null
    } catch (error) {
        console.error('토큰 디코딩 오류:', error);
        return null; // 디코딩 실패 시 null 반환
    }
};
