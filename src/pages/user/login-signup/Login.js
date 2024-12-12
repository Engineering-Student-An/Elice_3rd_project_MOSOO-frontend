import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 간단한 유효성 검사
        if (!email || !password) {
            setError('모든 필드를 입력해야 합니다.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { email, password });

            if (response.status === 200) {
                // 로그인 성공 시 처리 (예: 토큰 저장, 리다이렉트)
                localStorage.setItem('token', response.data.accessToken);
                alert('로그인 성공!');
                // 페이지 새로고침 후 대시보드 페이지로 이동
                window.location.href = '/'; // 전체 페이지 새로고침
            }
        } catch (err) {
            console.error('로그인 실패:', err);
            setError(err.response?.data?.message || '로그인에 실패했습니다.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_DOMAIN_URL}/oauth2/authorization/google`; // 구글 로그인 URL
    };

    return (
        <div style={styles.container}>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <button type="button" onClick={handleGoogleLogin} style={styles.button}>
                        구글로 로그인
                    </button>
                </div>
                <hr style={styles.divider} />
                <div style={styles.inputGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={styles.button}>
                    로그인
                </button>
            </form>
            <p style={styles.redirect}>
                아직 회원이 아니신가요?{' '}
                <button onClick={() => navigate('/signup')} style={styles.linkButton}>
                    회원가입하기
                </button>
            </p>
        </div>
    );
};

// 스타일 정의
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '20px',
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '450px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '15px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
    },
    redirect: {
        marginTop: '20px',
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '0',
    },
    divider: {
        margin: '20px 0',
        border: 'none',
        borderTop: '1px solid #ccc',
    },
};

export default Login;
