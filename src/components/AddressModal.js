import React, { useState } from "react";
import Address from "./Address";
import "./AddressModal.css";

const AddressModal = ({ onClose, onSelectAddress }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      onClose();
    } else {
      setErrorMessage("주소를 입력하지 않았습니다.");
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setErrorMessage(""); // 오류 메시지 초기화
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-body">
          {/* Address 컴포넌트 */}
          <Address onSelectAddress={handleSelectAddress} />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        <div className="address-modal-footer">
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
