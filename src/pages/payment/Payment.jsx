import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const OrderPage = () => {
  const { chatroomId } = useParams(); // URL에서 chatroomId 가져오기
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  // 아임포트 SDK 로드
  useEffect(() => {
    const loadIamportSDK = () => {
      if (!window.IMP) {
        const script = document.createElement('script');
        script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
        script.async = true;
        script.onload = () => {
          console.log('Iamport SDK loaded successfully.');
        };
        script.onerror = () => {
          console.error('Failed to load Iamport SDK.');
        };
        document.body.appendChild(script);
      }
    };

    loadIamportSDK();

    if (chatroomId) {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/api/orders?chatroomId=${chatroomId}`, {headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },})
        .then((response) => {
          setOrderDetails(response.data);
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });
    }
  }, [chatroomId]);

  const handlePayment = async () => {
    if (!orderDetails) return;

    const { price, merchantUid, postResponseDto, gosuResponseDto } = orderDetails;

    try {
      if (!window.IMP) {
        alert('Iamport SDK가 로드되지 않았습니다. 페이지를 새로고침 해주세요.');
        return;
      }

      const { IMP } = window;
      IMP.init('imp06015387'); // Replace with your actual PortOne (Iamport) key

      IMP.request_pay(
        {
          pg: 'kakaopay', // Adjust PG provider as needed
          pay_method: 'card',
          merchant_uid: merchantUid,
          name: postResponseDto.title, // 서비스 이름
          amount: price,
          buyer_name: gosuResponseDto.businessName, // 고수 이름
          buyer_addr: gosuResponseDto.gosuInfoAddress, // 고수 주소
        },
        async (response) => {
          console.log("imp 응답값 : " + response)
          if (response.success) {
            try {
              const backendResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/complete`, {
                merchantUid: response.merchant_uid,
                impUid: response.imp_uid
              },
                {
                  headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Accept': 'application/json', // JSON 응답 요청
                  'Content-Type': 'application/json',
                }, withCredentials: true
              }
            );
              navigate('/payment/success', { state: backendResponse.data });
            } catch (error) {
              console.error('Error completing payment on backend:', error);
              alert('결제는 성공했지만 서버 처리 중 문제가 발생했습니다. 고객센터에 문의해주세요.');
            }
          } else {
            alert(`결제에 실패했습니다: ${response.error_msg}`);
          }
        }
      );
    } catch (error) {
      console.error('Error initializing payment:', error);
      alert('결제 요청 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (!orderDetails) return <div>Loading...</div>;

  const { postResponseDto, bidResponseDto, gosuResponseDto, price } = orderDetails;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>주문서</h2>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>결제 정보</h3>
        <p>주문 날짜: {new Date().toLocaleDateString()}</p>
        <p>최종 금액: {price.toLocaleString()} 원</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>서비스 정보</h3>
        <p>{postResponseDto.title}</p>
        <p>{postResponseDto.address}</p>
        <p>예상 금액: {postResponseDto.price.toLocaleString()} 원</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>고수 정보</h3>
        {bidResponseDto ? (
          <>
            <p>고수 이름: {bidResponseDto.fullName}</p>
            <p>진행 가능 날짜: {new Date(bidResponseDto.date).toLocaleDateString()}</p>
            <p>위치: {gosuResponseDto.gosuInfoAddress}</p>
          </>
        ) : (
          <>
            <p>고수 이름: {gosuResponseDto.businessName}</p>
            <p>진행 가능 날짜: {postResponseDto.duration}</p>
            <p>위치: {gosuResponseDto.gosuInfoAddress}</p>
          </>
        )}
      </div>

      <button
        onClick={handlePayment}
        style={{
          backgroundColor: '#6200ee',
          color: '#fff',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto',
        }}
      >
        결제하기
      </button>
    </div>
  );
};

export default OrderPage;