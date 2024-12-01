import React, {useEffect, useState} from "react";
import axios from "axios";

const PostInfo = ({ chatRoomId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [post, setPost] = useState(null);
    const [price, setPrice] = useState(null);
    const [bid, setBid] = useState(null);
    const [isGosu, setIsGosu] = useState(null);
    const [inputPrice, setInputPrice] = useState(null); // 입력값을 위한 상태
    const [originalPrice, setOriginalPrice] = useState(null); // 원래 가격을 저장하는 상태
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchInfos();
    }, [chatRoomId]);

    const fetchInfos = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chatroom/${chatRoomId}/info`);
            setPost(response.data.postResponseDto);
            setBid(response.data.bidResponseDto);
            setPrice(response.data.price);
            setIsGosu(response.data.isGosu);

            // 가격 상태를 업데이트한 후 inputPrice와 originalPrice 업데이트
            setInputPrice(price);
            setOriginalPrice(price);

        } catch (err) {
            setError(err);
            console.error('Failed to load infos:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                Error loading infos: {error.response ? error.response.data.message : error.message}
            </div>
        );
    }

    const handlePriceChange = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chatroom/${chatRoomId}/price?price=${inputPrice}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('가격 변경에 실패했습니다.');
            }

            const data = await response.json();
            // 요청이 성공하면 반환된 가격으로 상태 업데이트
            setInputPrice(data.price);
            setOriginalPrice(data.price); // 원래 가격도 업데이트
            setIsEditing(false); // 편집 모드 종료

            alert('가격이 변경되었습니다.');
        } catch (error) {
            console.error(error);
            alert('가격 변경 중 오류가 발생했습니다.');
        }
    };

    const handleEditClick = () => {
        setOriginalPrice(inputPrice); // 수정 시작 전에 원래 가격 저장
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setInputPrice(originalPrice); // 원래 가격으로 되돌리기
        setIsEditing(false);
    };

    return (
        <div className="d-flex flex-column align-items-end">
            <div>
                {/*게시글 관련 정보*/}
                <div className="mb-30">
                    <h3>
                        <a href={`/post/${post.id}`}>{post.title}</a>
                    </h3>

                    <p>{post.description.length > 30
                        ? `${post.description.substring(0, 30)}...`
                        : post.description}
                    </p>
                    {post.duration && (<p>기간: {post.duration}</p>)}
                </div>


                {/*입찰 관련 정보 (존재한다면)*/}
                {bid && (
                    <div className="mb-30">
                        <h3>입찰 정보</h3>
                        {bid.price && (<p>입찰 금액: {new Intl.NumberFormat('ko-KR').format(inputPrice)} 원</p>)}
                        {bid.date && (<p>진행 날짜: {bid.date}</p>)}
                    </div>
                )}


                <h3>가격</h3>
                {isEditing ? (
                    <div>
                        <input
                            type="number"
                            value={inputPrice} // 입력 필드의 값은 이제 inputPrice
                            className="form-control"
                            onChange={(e) => setInputPrice(e.target.value)} // 입력값 상태만 업데이트
                        />
                        <button className="btn btn-sm p-0" onClick={handlePriceChange}>
                            <span className="material-icons" style={{color: 'green'}}>check</span>
                        </button>
                        <button className="btn btn-sm p-0" onClick={handleCancelClick}>
                            <span className="material-icons" style={{color: 'red'}}>close</span>
                        </button>
                    </div>
                ) : (
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <p style={{
                            fontSize: '30px',
                            color: '#272727FF'
                        }}>{new Intl.NumberFormat('ko-KR').format(inputPrice)} 원</p> {/* 가격 형식화 */}
                        {isGosu && ( // isGosu가 true인 경우에만 edit 버튼을 표시
                            <button className="btn btn-sm p-0" onClick={handleEditClick}>
                                <span className="material-icons" style={{color: 'purple'}}>edit</span>
                            </button>
                        )}
                    </div>
                )}

                <div className="mb-30"></div>
            </div>

            {!isGosu && (
                //TODO: 주문서 페이지로 이동
                <a href="/" className="purple-button">주문하기</a>
            )}

        </div>
    );
};

export default PostInfo;
