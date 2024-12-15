import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import SearchCategory from '../../../components/SearchCategory';
import AddressModal from '../../../components/AddressModal';
import './TechProvide.css';

const TechProvide = () => {


    const [techInfo, setTechInfo] = useState({
        userInfoId: "",
        gender: '',
        businessName: '',
        businessNumber: '',
        phoneNumber: '',
        verificationCode: '',
        gosuInfoAddress: '', // 주소 필드 추가
    });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [error, setError] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const [isPhoneDisabled, setIsPhoneDisabled] = useState(false); // 추가된 상태
    const [userInfoId, setUserInfoId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('User data response:', response.data); // 응답 확인
                    const userInfoId = response.data.userInfoDto.id; // userInfoId 추출
                    setUserInfoId(userInfoId); // userInfoId 상태에 저장
                } catch (error) {
                    console.error('사용자 정보를 가져오는 데 오류가 발생했습니다:', error);
                    setError('사용자 정보를 가져오는 데 오류가 발생했습니다.');
                }
            } else {
                setError('토큰이 존재하지 않습니다.');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setTechInfo({...techInfo, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedCategory || !selectedCategory.categoryId || !selectedAddress || !techInfo.gender || !techInfo.businessName || !techInfo.businessNumber) {
            setError('모든 필드를 채워주세요.');
            return;
        }

        if (!isVerified) {
            setError('전화번호 인증을 완료해야 합니다.');
            return;
        }

        const token = localStorage.getItem('token');
        try {

            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/gosu`, {
                userInfoId: userInfoId, // userInfoId 추가
                gender: techInfo.gender,
                businessName: techInfo.businessName,
                businessNumber: techInfo.businessNumber,
                gosuInfoAddress: selectedAddress, // 선택된 주소
                gosuInfoPhone: techInfo.phoneNumber, // 전화번호
                categoryId: selectedCategory.categoryId // 선택된 카테고리 ID
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('기술 제공 정보가 성공적으로 저장되었습니다.');
            window.location.href = '/mypage';
        } catch (error) {
            console.error('기술 제공 정보 저장 오류:', error);
            setError('기술 제공 정보 저장 중 오류가 발생했습니다.');
        }
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setShowCategoryModal(false);
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(false);
    };

    const openCategoryModal = () => {
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
    };

    const openAddressModal = () => {
        setShowAddressModal(true);
    };

    const closeAddressModal = () => {
        setShowAddressModal(false);
    };

    const verifyPhoneNumber = () => {
        const phonePattern = /^(010-\d{4}-\d{4}|010\d{8})$/; // 한국 휴대폰 번호 정규 표현식

        if (phonePattern.test(techInfo.phoneNumber)) {
            setIsVerified(true);
            setIsPhoneDisabled(true); // 입력 비활성화
            alert('전화번호 인증이 완료되었습니다.');
        } else {
            setError('올바른 전화번호 형식이 아닙니다. 형식: 010-1234-5678 또는 01012345678');
        }
    };

    {/*
    const requestVerificationCode = async () => {
        try {
          await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/request-verification-code`, {
            phoneNumber: techInfo.phoneNumber,
          });
          alert('인증 코드가 전송되었습니다.');
        } catch (error) {
          console.error('인증 코드 요청 오류:', error);
          setError('인증 코드 요청 중 오류가 발생했습니다.');
        }
      };


    const verifyCode = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/verify-code`, {
          phoneNumber: techInfo.phoneNumber,
          verificationCode: techInfo.verificationCode,
        });
        if (response.data.success) {
          setIsVerified(true);
          alert('전화번호 인증이 완료되었습니다.');
        } else {
          setError('인증 코드가 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('인증 코드 확인 오류:', error);
        setError('인증 코드 확인 중 오류가 발생했습니다.');
      }
    };

    */
    }

    return (
        <div className="tech-provide">
            <h2>기술 제공 정보 입력</h2>
            <form onSubmit={handleSubmit} className="tech-provide-form">
                {/* 성별 선택 */}
                <div className="form-group">
                    <label htmlFor="gender">
                        성별 *
                        <select
                            name="gender"
                            value={techInfo.gender}
                            onChange={handleChange}
                            className="tech-provide-input"
                            id="gender"
                        >
                            <option value="">선택하세요</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                            <option value="other">기타</option>
                        </select>
                    </label>
                </div>

                {/* 사업자명 입력 */}
                <div className="form-group">
                    <label htmlFor="businessName">
                        사업자명 *
                        <input
                            type="text"
                            name="businessName"
                            value={techInfo.businessName}
                            onChange={handleChange}
                            className="tech-provide-input"
                            id="businessName"
                        />
                    </label>
                </div>

                {/* 사업자번호 입력 */}
                <div className="form-group">
                    <label htmlFor="businessNumber">
                        사업자번호 *
                        <input
                            type="text"
                            name="businessNumber"
                            value={techInfo.businessNumber}
                            onChange={handleChange}
                            className="tech-provide-input"
                            id="businessNumber"
                        />
                    </label>
                </div>

                {/* 전화번호 입력 */}
                <label className="phone-number-label">
                    전화번호 *
                    <input
                        type="text"
                        name="phoneNumber"
                        value={techInfo.phoneNumber}
                        onChange={handleChange}
                        className="tech-provide-input"
                        placeholder="전화번호 입력"
                        disabled={isPhoneDisabled}
                    />
                    <button type="button" onClick={verifyPhoneNumber} className="tech-provide-submit">확인</button>
                </label>

                {/* 인증 코드 *
                   <input
                    type="text"
                    name="verificationCode"
                    value={techInfo.verificationCode}
                    onChange={handleChange}
                    className="tech-provide-input"
                    placeholder="인증 코드 입력"
                  /> */}

                {/*<button type="button" onClick={requestVerificationCode} className="tech-provide-submit">인증 코드 요청</button>*/}

                {/* 에러 메시지를 제출 버튼 위에 배치 */}


                <div className="tech-provide-row">
                    <div className="col-lg-3 col-md-3 col-12 p-0">
                        <div className="search-input">
                            <label htmlFor="category">
                                <i className="lni lni-grid-alt theme-color"></i>
                            </label>
                            <button
                                type="button"
                                id="category"
                                className="btn category-btn"
                                onClick={openCategoryModal}
                            >
                                {selectedCategory ? selectedCategory.name : '카테고리 선택'}
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-12 p-0">
                        <div className="search-input">
                            <label htmlFor="location">
                                <i className="lni lni-map-marker theme-color"></i>
                            </label>
                            <button
                                type="button"
                                id="location"
                                className="btn location-btn"
                                onClick={openAddressModal}
                            >
                                {selectedAddress || '지역 선택'}
                            </button>
                        </div>
                    </div>
                </div>
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}

                <button type="submit" className="tech-provide-submit">제출</button>
            </form>

            {showCategoryModal &&
                <SearchCategory onClose={closeCategoryModal} onSelectCategory={handleSelectCategory}/>}
            {showAddressModal && <AddressModal onClose={closeAddressModal} onSelectAddress={handleSelectAddress}/>}
        </div>
    );
};

export default TechProvide;
