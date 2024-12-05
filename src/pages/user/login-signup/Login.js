// src/pages/user/login-signup/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './firebase'; // 경로 수정
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 간단한 유효성 검사
        if (!formData.email || !formData.password) {
            setError('모든 필드를 입력해야 합니다.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('로그인에 실패했습니다.');
            }

            // 성공적으로 로그인된 경우 처리할 내용
            alert('로그인 성공!');
            // 대시보드 또는 메인 페이지로 리다이렉트
            navigate('/dashboard'); // 대시보드 페이지로 리다이렉트
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            alert('로그인 성공!');
            navigate('/dashboard'); // 대시보드 또는 메인 페이지로 리다이렉트
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <button onClick={handleGoogleLogin} style={styles.button}>구글로 로그인</button>
                </div>
                <hr style={styles.divider} /> {/* 구분선 추가 */}
                <div style={styles.inputGroup}>
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={styles.button}>로그인</button>
            </form>
            <p style={styles.redirect}>
                아직 회원이 아니신가요? <button onClick={() => navigate('/signup')} style={styles.linkButton}>회원가입하기</button>
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
        height: '100vh', // 화면 중앙에 위치
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
        margin: '20px 0', // 구분선의 상하 여백
        border: 'none',
        borderTop: '1px solid #ccc', // 구분선 스타일
    },
};

export default Login;
