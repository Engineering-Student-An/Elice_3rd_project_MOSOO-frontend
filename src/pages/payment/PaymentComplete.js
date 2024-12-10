import React from "react";
import { useLocation } from "react-router-dom";

import "./PaymentComplete.css";
import "../../components/button.css";

const PaymentComplete = () => {
  const location = useLocation();
  const responseData = location.state;

  // 금액 포맷팅 (숫자를 0원 형식으로 변환)
  const formattedPrice = `${responseData.price.toLocaleString()} 원`;

  // 날짜 포맷팅 (날짜를 2024-00-00 형식으로 변환)
  const formattedDate = new Date(responseData.createTime)
    .toISOString()
    .split("T")[0];

  return (
    <div className="payment-complete-container">
      <div
        style={{
          position: "sticky",
          top: "0",
          backgroundColor: "white",
          zIndex: "99",
        }}
      >
        <h2>결제 완료</h2>
        <hr />
      </div>

      <div className="d-flex flex-row justify-content-center align-items-center">
        <div className="payment-complete-card">
          <h4>결제 완료 되었습니다.</h4>

          <p>결제 금액: {formattedPrice}</p>
          <p>결제 완료 일자: {formattedDate}</p>

          <a href="/usages" className="purple-button mt-50">
            이용 서비스 보기
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentComplete;

