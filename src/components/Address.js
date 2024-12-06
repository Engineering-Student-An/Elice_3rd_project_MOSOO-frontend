import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

const Address = ({ onSelectAddress }) => {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [inputAddress, setInputAddress] = useState("");

  // 주소 검색
  const handleComplete = (data) => {

    // '~동' 또는 '~리'까지만 추출
    const extractShortJibunAddress = (jibunAddress) => {
      const match = jibunAddress.match(/.*[동|리](?=\s|$)/); // 마지막 ~동/~리 추출
      return match ? match[0] : jibunAddress; // 매칭되면 해당 부분 반환, 없으면 전체 반환
    };

    let selectedAddress = '';
    if (data.jibunAddress) {
      selectedAddress = extractShortJibunAddress(data.jibunAddress);
    } else {
      selectedAddress = data.address; // 지번 주소가 없으면 기본 주소 저장
    }

    setAddress(selectedAddress);
    setIsPostcodeOpen(false);
    onSelectAddress(selectedAddress);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>주소 검색</h2>
      <div>
        <button
          className="purple-button"
          onClick={() => setIsPostcodeOpen(!isPostcodeOpen)}
        >
          주소 검색
        </button>
      </div>
      {isPostcodeOpen && (
        <div style={{ position: 'relative', zIndex: 100 }}>
          <DaumPostcode onComplete={handleComplete} autoClose={false} />
        </div>
      )}
      {address && (
        <div style={{ marginTop: '20px' }}>
          <p>{address}</p>
        </div>
      )}
    </div>
  );
};

export default Address;
