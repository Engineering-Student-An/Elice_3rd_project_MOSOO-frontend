import React, { useState } from "react";
import Address from "./Address";
import "./AddressModal.css";

const AddressModal = ({ onClose, onSelectAddress }) => {
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleSave = () => {
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      onClose();
    } else {
      alert("주소를 입력하지 않았습니다.");
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-body">
          {/* Address 컴포넌트 */}
          <Address onSelectAddress={handleSelectAddress} />
        </div>
        <div className="address-modal-footer">
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
