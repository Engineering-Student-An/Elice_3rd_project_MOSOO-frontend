import React, { useState, useEffect } from "react";
import Step1 from "../pages/category/components/FirstCategory";
import Step2 from "../pages/category/components/SecondCategory";
import Step3 from "../pages/category/components/ThirdCategory";
import "./SearchCategory.css";

const SearchCategory = ({ onClose, onSelectCategory }) => {
  const [step, setStep] = useState(1); // 단계 상태
  const [firstCategory, setFirstCategory] = useState(null);
  const [selectedSecondcategory, setSelectedSecondcategory] = useState(null); // 선택된 중분류 상태
  const [thirdCategory, setThirdCategory] = useState(null);

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
        return <Step1 onSelectFirstcategory={setFirstCategory} />;
      case 2:
        return <Step2 category_id={firstCategory.category_id} onSelectSecondcategory={setSelectedSecondcategory} />;
      case 3:
        return <Step3 selectedSubcategory={selectedSecondcategory} onSelectThirdCategory={setThirdCategory} />;
      default:
        return null;
    }
  };

  // 진행도 계산
  const progress = (step / 3) * 100;

  // 다음 단계로 이동하는 함수
  const nextStep = () => {
        if (step < 3) {
      setStep(step + 1);
    } else {
      handleSearch();
    }
  };

  // 이전 단계로 이동하는 함수
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSearch = () => {
    console.log("검색 버튼 클릭됨");
    console.log("ThirdCategory ID:", thirdCategory?.category_id || "소분류가 설정되지 않았습니다.");

    onSelectCategory(thirdCategory);

    onClose();
  };

  return (
    <div className="main-modal-overlay" onClick={handleOverlayClick}>
      <div className={`main-modal-content ${step === 1 ? 'step1' : ''}`}>
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
            {step === 3 ? "저장" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCategory;