import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Address";
import Step2 from "../pages/category/components/FirstCategory";
import Step3 from "../pages/category/components/SecondCategory";
import Step4 from "../pages/category/components/ThirdCategory";
import "./SearchRequestPosts.css";

const SearchRequestPosts = ({ onClose }) => {
  const [step, setStep] = useState(1); // 단계 상태
  const [selectedAddress, setSelectedAddress] = useState('');
  const [firstCategory, setFirstCategory] = useState(null);
  const [selectedSecondcategory, setSelectedSecondcategory] = useState(null);
  const [thirdCategory, setThirdCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("step 상태가 변경됨:", step);
  }, [step]);
  
  // 이벤트 핸들러
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('main-modal-overlay')) {
      onClose();
    }
  };

  // 각 단계 컴포넌트 렌더링
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 onSelectAddress={setSelectedAddress} />;
      case 2:
        return <Step2 onSelectFirstcategory={setFirstCategory} />;
      case 3:
        return <Step3 categoryId={firstCategory?.categoryId} onSelectSecondcategory={setSelectedSecondcategory} />;
      case 4:
        return <Step4 selectedSubcategory={selectedSecondcategory} onSelectThirdCategory={setThirdCategory} />;
      default:
        return null;
    }
  };

  // 진행도 계산
  const progress = (step / 4) * 100;

  // 다음 단계로 이동하는 함수
  const nextStep = () => {

    if (step === 1 && !selectedAddress) {
      alert("주소를 입력하지 않았습니다.");
      return;
    }
    if (step === 2 && !firstCategory) {
      alert("대분류를 선택하지 않았습니다.");
      return;
    }
    if (step === 3 && !selectedSecondcategory) {
      alert("중분류를 선택하지 않았습니다.");
      return;
    }
    if (step === 4 && !thirdCategory) {
      alert("소분류를 선택하지 않았습니다.");
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSearch();
    }
  };

  // 이전 단계로 이동하는 함수
  const prevStep = () => {
    if (step > 1) {
      if (step === 2) {
        setSelectedAddress('');
      } else if (step === 3) {
        setFirstCategory(null);
      } else if (step === 4) {
        setSelectedSecondcategory(null);
      }
      setThirdCategory(null);
      setStep(step - 1);
    }
  };

  const handleSearch = () => {
    console.log("검색 버튼 클릭됨");
    console.log("address:", selectedAddress || "주소가 설정되지 않았습니다.");
    console.log("ThirdCategory ID:", thirdCategory?.categoryId || "소분류가 설정되지 않았습니다.");

    navigate('/offerPostsFilter',
        { state: 
            { 
            address: selectedAddress, 
            categoryId: thirdCategory.categoryId,
            isOffer: false
        } });

  };

  return (
    <div className="main-modal-overlay" onClick={handleOverlayClick}>
      <div className={`main-modal-content ${step === 2 ? 'step2' : ''}`}>
        <div className="main-modal-body">
          {renderStepContent()}
        </div>

        {/* 진행 바 추가 */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="main-modal-footer">
          <button onClick={prevStep} disabled={step === 1}>
            이전
          </button>
          <button onClick={nextStep}>
            {step === 4 ? "검색" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchRequestPosts;
