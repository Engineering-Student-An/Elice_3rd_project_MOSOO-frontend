// src/pages/user/login-signup/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './firebase'; // 경로 수정
import { signInWithPopup } from 'firebase/auth';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleGoogleSignUp = async () => {
        try {
            await signInWithPopup(auth, provider);
            alert('회원가입 성공!');
            navigate('/dashboard'); // 대시보드 또는 메인 페이지로 리다이렉트
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 간단한 유효성 검사
        if (!formData.fullname || !formData.email || !formData.password) {
            setError('모든 필드를 입력해야 합니다.');
            return;
        }

        // 여기서 이메일/비밀번호로 회원가입 로직을 추가할 수 있습니다.

        alert('회원가입 성공!');
        navigate('/login'); // 로그인 페이지로 리다이렉트
    };

    return (
        <div style={styles.container}>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                <button onClick={handleGoogleSignUp} style={styles.button}>구글로 가입하기</button>
                <hr style={styles.divider} /> {/* 구분선 추가 */}
                    <label htmlFor="fullname">사용자 이름:</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
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
                <button type="submit" style={styles.button}>가입하기</button>
            </form>

            <p style={styles.redirect}>
                이미 회원이신가요? <button onClick={() => navigate('/login')} style={styles.linkButton}>로그인하기</button>
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
};

export default SignUp;
