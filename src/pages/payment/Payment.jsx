import React, { useEffect, useState } from 'react';
import { Card, Form, Button } from "react-bootstrap";
import axios from 'axios';
import {Navigate, useParams} from 'react-router-dom';

const Payment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams(); // URL에서 주문 ID를 가져옴 (필요한 경우)
  const [redirect, setRedirect] = useState(false);  // 리다이렉트 여부
  const [responseData, setResponseData] = useState(null);   // 결제 완료 후 응답
  // 포트원 SDK 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 서버에서 결제 데이터 가져오기
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/prepare`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // JWT 토큰이 필요한 경우
          }
        });
        setPaymentData(response.data);
      } catch (error) {
        console.error('결제 데이터 로딩 실패:', error);
        alert('결제 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const onClickPayment = () => {
    if (!window.IMP) {
      alert('포트원 SDK가 로드되지 않았습니다.');
      return;
    }

    if (!paymentData) {
      alert('결제 정보가 없습니다.');
      return;
    }

    const IMP = window.IMP;
    IMP.init('imp06015387');

    // 서버에서 받아온 데이터로 결제 요청
    const requestData = {
      pg: 'kakaopay',
      pay_method: 'card',
      merchant_uid: paymentData.merchantUid,
      amount: paymentData.amount,
      name: paymentData.productName,
      buyer_name: paymentData.buyerName,
      buyer_tel: paymentData.buyerTel,
      buyer_email: paymentData.buyerEmail,
      buyer_addr: paymentData.buyerAddr,
      buyer_postcode: paymentData.buyerPostcode,
    };

    IMP.request_pay(requestData, callback);
  };

  const callback = async (response) => {
    const {
      success,
      error_msg,
      imp_uid,
      merchant_uid,
      paid_amount,
      status
    } = response;

    if (success) {
      try {
        // 결제 성공 시 서버에 결제 완료 정보 전송
        //1. response 를 백엔드로 모두 보내자.
        //2. 돌려보고 어떤 데이터가 넘어오는지 확인 - 사용해야하는 데이터 확인해보기 (cs 대응)
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/complete`, {
          impUid: imp_uid,
          merchantUid: merchant_uid,
          amount: paid_amount,
          status: status
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setResponseData(response.data);
        setRedirect(true);
        alert('결제가 성공적으로 완료되었습니다.');
        // 결제 완료 후 리다이렉션
        // window.location.href = '/payment/success';
      } catch (error) {
        console.error('결제 완료 처리 실패:', error);
        alert('결제는 성공했으나 서버 처리에 실패했습니다.');
      }
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  };

  if(redirect) {
    return <Navigate to="/payment/success" state={{ responseData }}/>;
  }

  if (loading) {
    return <div className="text-center py-5">로딩중...</div>;
  }

  return (
    <div className="container py-5">
      <Card className="mx-auto" style={{ maxWidth: '500px' }}>
        <Card.Header>
          <h4 className="text-center mb-0">상품 결제</h4>
        </Card.Header>
        <Card.Body>
          {paymentData && (
            <>
              <div className="text-center mb-4">
                <p className="h5 mb-2">결제 금액: {paymentData.amount.toLocaleString()}원</p>
                <p className="mb-2">상품명: {paymentData.productName}</p>
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
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Payment;
