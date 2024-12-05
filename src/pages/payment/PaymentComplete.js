import React from "react";

import './PaymentComplete.css';
import '../../components/button.css';

const PaymentComplete = () => {

    // 데이터를 서버에서 받는 axios


    return (
        <div className="payment-complete-container">
            <div style={{position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '99'}}>
                <h2>결제 완료</h2>
                <hr/>
            </div>

            <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="payment-complete-card">
                    <h4>결제 완료 되었습니다.</h4>
                    <p>진행 날짜:</p>
                    <p>결제 금액:</p>
                    <p>결제 완료 일자:</p>

                    <a href="/usages" className="purple-button mt-50">
                        이용 서비스 보기
                    </a>
                </div>
            </div>

        </div>
    );
}

export default PaymentComplete;
