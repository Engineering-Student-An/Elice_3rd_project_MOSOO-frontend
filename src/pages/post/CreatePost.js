import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [images, setImages] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState(''); // 상위 카테고리 ID 상태 추가
    const [categories, setCategories] = useState([]); // 상위 카테고리 리스트 상태
    const [subCategories, setSubCategories] = useState([]); // 하위 카테고리 리스트 상태
    const [isOffer, setIsOffer] = useState(false);
    const [userId] = useState(1); // 예시로 하드코딩된 userId. 실제로는 로그인된 사용자 정보로 교체 필요.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 상위 카테고리 API 요청
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/category/first_category');
                setCategories(response.data); // 상위 카테고리 데이터를 상태에 저장
            } catch (err) {
                console.error('상위 카테고리 불러오기 실패:', err);
                setError('상위 카테고리를 불러오는 데 실패했습니다.');
            }
        };

        fetchCategories();
    }, []);

    // 하위 카테고리 API 요청
    useEffect(() => {
        if (parentCategoryId) {
            const fetchSubCategories = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/category/${parentCategoryId}`);
                    setSubCategories(response.data); // 하위 카테고리 데이터를 상태에 저장
                } catch (err) {
                    console.error('하위 카테고리 불러오기 실패:', err);
                    setError('하위 카테고리를 불러오는 데 실패했습니다.');
                }
            };

            fetchSubCategories();
        } else {
            setSubCategories([]); // 상위 카테고리가 선택되지 않으면 하위 카테고리 리스트를 비웁니다.
        }
    }, [parentCategoryId]); // parentCategoryId가 변경될 때마다 하위 카테고리 데이터를 다시 로드합니다.

    const handleImageChange = (event) => {
        setImages(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !description || !price || !duration || !categoryId) {
            setError('모든 필드를 채워주세요.');
            return;
        }

        setLoading(true);
        setError('');

        // FormData 생성
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('duration', duration);
        formData.append('status', 'OPEN');  // 기본값으로 OPEN 상태 추가
        formData.append('isOffer', isOffer);
        formData.append('userId', userId);
        formData.append('categoryId', categoryId);

        // 이미지 파일 추가
        for (let i = 0; i < images.length; i++) {
            formData.append('imageUrls', images[i]);
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/post', // 실제 API URL로 교체
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log('게시글 생성 성공:', response.data);
            // 성공적으로 게시글이 생성된 후 처리 (예: 성공 메시지, 리디렉션 등)
        } catch (error) {
            console.error('게시글 생성 실패:', error);
            setError('게시글 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">게시글 작성</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* 제목 */}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">제목</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* 설명 */}
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">설명</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* 가격 */}
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">가격</label>
                    <input
                        type="number"
                        id="price"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                {/* 기간 */}
                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">기간</label>
                    <input
                        type="text"
                        id="duration"
                        className="form-control"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </div>

                {/* 상위 카테고리 선택 */}
                <div className="mb-3">
                    <label htmlFor="parentCategory" className="form-label">상위 카테고리</label>
                    <select
                        id="parentCategory"
                        className="form-select"
                        value={parentCategoryId}
                        onChange={(e) => setParentCategoryId(e.target.value)}
                    >
                        <option value="">상위 카테고리 선택</option>
                        {categories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 하위 카테고리 선택 */}
                {parentCategoryId && (
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">하위 카테고리</label>
                        <select
                            id="category"
                            className="form-select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">하위 카테고리 선택</option>
                            {subCategories.map((subCategory) => (
                                <option key={subCategory.category_id} value={subCategory.category_id}>
                                    {subCategory.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 이미지 업로드 */}
                <div className="mb-3">
                    <label htmlFor="images" className="form-label">이미지 업로드</label>
                    <input
                        type="file"
                        id="images"
                        className="form-control"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>

                {/* isOffer 선택 */}
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        id="isOffer"
                        className="form-check-input"
                        checked={isOffer}
                        onChange={() => setIsOffer(!isOffer)}
                    />
                    <label htmlFor="isOffer" className="form-check-label">오퍼 게시글로 설정</label>
                </div>

                {/* 제출 버튼 */}
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? '로딩 중...' : '게시글 작성'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
