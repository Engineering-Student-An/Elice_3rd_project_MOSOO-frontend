import { jwtDecode } from 'jwt-decode';

export const isAdmin = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.auth === 'ROLE_ADMIN';
    } catch (error) {
        console.error('토큰 디코딩 오류:', error);
        return false;
    }
};