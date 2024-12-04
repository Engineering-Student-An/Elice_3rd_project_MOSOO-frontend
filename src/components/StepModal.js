import React, { useState } from "react";
import Step1 from "../pages/category/components/FirstCategoryModal";
import Step2 from "../pages/category/components/SecondCategoryModal";
import Step3 from "../pages/category/components/ThirdCategoryModal";
import "./StepModal.css";

const StepModal = ({ category_id, onClose }) => {
  const [step, setStep] = useState(1); // 단계 상태
  const [selectedSecondcategory, setSelectedSecondcategory] = useState(null); // 선택된 중분류 상태

  // 각 단계 컴포넌트 렌더링
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 category_id={category_id} />;
      case 2:
        return <Step2 category_id={category_id} onSelectSecondcategory={setSelectedSecondcategory} />;
      case 3:
        return <Step3 category_id={category_id} selectedSubcategory={selectedSecondcategory} />;
      default:
        return null;
    }
  };

  // 다음 단계로 이동하는 함수
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  // 이전 단계로 이동하는 함수
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="main-modal-overlay">
      <div className="main-modal-content">
        <div className="main-modal-body">
          {renderStepContent()}
        </div>
        <div className="main-modal-footer">
          <button onClick={prevStep} disabled={step === 1}>
            이전
          </button>
          <button onClick={nextStep} disabled={step === 3}>
            다음
          </button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default StepModal;