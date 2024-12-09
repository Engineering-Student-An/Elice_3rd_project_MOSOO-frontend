import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Address";
import Step2 from "../pages/category/components/SecondCategory";
import Step3 from "../pages/category/components/ThirdCategory";
import "./StepModal.css";


const StepModal = ({ categoryId, onClose }) => {
  const [step, setStep] = useState(1); // 단계 상태
  const [selectedSecondcategory, setSelectedSecondcategory] = useState(null); // 선택된 중분류 상태
  const [address, setAddress] = useState(null);
  const [thirdCategory, setThirdCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
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
        return <Step1 onSelectAddress={setAddress} />;
      case 2:
        return <Step2 categoryId={categoryId} onSelectSecondcategory={setSelectedSecondcategory} />;
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
    
    if (step === 1 && !address) {
      setErrorMessage("주소를 입력하지 않았습니다.");
      return;
    }
    if (step === 2 && !selectedSecondcategory) {
      setErrorMessage("중분류를 선택하지 않았습니다.");
      return;
    }
    if (step === 3 && !thirdCategory) {
      setErrorMessage("소분류를 선택하지 않았습니다.");
      return;
    }

    setErrorMessage("");

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
    console.log("주소 정보:", address || "주소가 설정되지 않았습니다.");
    console.log("ThirdCategory ID:", thirdCategory?.categoryId || "소분류가 설정되지 않았습니다.");

    navigate("/offerPosts", {
      state: {
        address: address,
        thirdCategory: thirdCategory?.categoryId
      },
    });

    onClose();
  };

  return (
    <div className="main-modal-overlay" onClick={handleOverlayClick}>
      <div className="main-modal-content">
        <div className="main-modal-body">
          {renderStepContent()}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
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
            {step === 3 ? "검색" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepModal;
