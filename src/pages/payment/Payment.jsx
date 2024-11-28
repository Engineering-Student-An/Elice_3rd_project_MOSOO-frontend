import React, { useEffect } from 'react';
import { Card, Form, Button } from "react-bootstrap";

const Payment = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onClickPayment = () => {
    if (!window.IMP) {
      alert('포트원 SDK가 로드되지 않았습니다.');
      return;
    }

    const IMP = window.IMP;
    IMP.init('imp06015387');

    const paymentData = {
      pg: 'kakaopay',
      pay_method: 'card',
      merchant_uid: `mid_${new Date().getTime()}`,
      amount: 1000,
      name: '상품 주문',
      buyer_name: '구매자이름',
      buyer_tel: '010-1234-5678',
      buyer_email: 'buyer@example.com',
      buyer_addr: '서울특별시 강남구',
      buyer_postcode: '123-456',
    };

    IMP.request_pay(paymentData, callback);
  };

  const callback = (response) => {
    const {
      success,
      error_msg,
      imp_uid,
      merchant_uid,
      paid_amount,
      status
    } = response;

    if (success) {
      alert('결제 성공');
      console.log('결제 성공', {
        imp_uid,
        merchant_uid,
        paid_amount,
        status
      });
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  };

  return (
    <div className="container py-5">
      <Card className="mx-auto" style={{ maxWidth: '500px' }}>
        <Card.Header>
          <h4 className="text-center mb-0">상품 결제</h4>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <p className="h5 mb-2">결제 금액: 1,000원</p>
            <Form.Text className="text-muted">
              카카오페이로 안전하게 결제하세요
            </Form.Text>
          </div>
          <Button 
            variant="warning"
            className="w-100"
            onClick={onClickPayment}
          >
            카카오페이로 결제하기
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Payment;