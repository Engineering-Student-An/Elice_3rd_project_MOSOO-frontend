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
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isOffer, setIsOffer] = useState(false);
    const [userId] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/api/category/first_category`, // 템플릿 리터럴 수정
                    { withCredentials: true } // 옵션은 객체로 전달
                );
                setCategories(response.data);
            } catch (err) {
                console.error('상위 카테고리 불러오기 실패:', err);
                setError('상위 카테고리를 불러오는 데 실패했습니다.');
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (parentCategoryId) {
            const fetchSubCategories = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/category/${parentCategoryId}`,
                        { withCredentials: true });
                    setSubCategories(response.data);
                } catch (err) {
                    console.error('하위 카테고리 불러오기 실패:', err);
                    setError('하위 카테고리를 불러오는 데 실패했습니다.');
                }
            };

            fetchSubCategories();
        } else {
            setSubCategories([]);
        }
    }, [parentCategoryId]);

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

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('duration', duration);
        formData.append('status', 'OPEN');
        formData.append('isOffer', isOffer);
        formData.append('userId', userId);
        formData.append('categoryId', categoryId);

        for (let i = 0; i < images.length; i++) {
            formData.append('imageUrls', images[i]);
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/post`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log('게시글 생성 성공:', response.data);
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
                <div className="row">
                    {/* 왼쪽 텍스트 영역 */}
                    <div className="col-md-6">
                        <div className="mb-5">
                            <h5>제목</h5>
                            <p>게시글의 제목을 입력하세요.</p>
                        </div>
                        <div className="mb-5">
                            <h5>설명</h5>
                            <p>게시글에 대한 상세 설명을 입력하세요.</p>
                        </div>
                        <div className="mb-5">
                            <h5>가격</h5>
                            <p>서비스나 제품의 가격을 입력하세요.</p>
                        </div>
                        <div className="mb-5">
                            <h5>기간</h5>
                            <p>제공 가능한 기간을 입력하세요.</p>
                        </div>
                    </div>

                    {/* 오른쪽 입력 영역 */}
                    <div className="col-md-6">
                        {/* 제목 입력 */}
                        <div className="mb-5">
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                placeholder="제목"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* 설명 입력 */}
                        <div className="mb-5">
                            <textarea
                                id="description"
                                className="form-control"
                                placeholder="설명"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* 가격 입력 */}
                        <div className="mb-5">
                            <input
                                type="number"
                                id="price"
                                className="form-control"
                                placeholder="가격"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        {/* 기간 입력 */}
                        <div className="mb-5">
                            <input
                                type="text"
                                id="duration"
                                className="form-control"
                                placeholder="기간"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* 카테고리 선택 */}
                <div className="mb-5">
                    <h5>카테고리</h5>
                    <p>적합한 상위 및 하위 카테고리를 선택하세요.</p>
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
                {parentCategoryId && (
                    <div className="mb-5">
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
                <div className="mb-5">
                    <h5>이미지</h5>
                    <p>관련된 이미지를 업로드하세요. 여러 개의 파일을 선택할 수 있습니다.</p>
                    <input
                        type="file"
                        id="images"
                        className="form-control"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>

                {/* 오퍼 설정 */}
                <div className="mb-5 form-check">
                    <input
                        type="checkbox"
                        id="isOffer"
                        className="form-check-input"
                        checked={isOffer}
                        onChange={() => setIsOffer(!isOffer)}
                    />
                    <label htmlFor="isOffer" className="form-check-label">고수 게시글로 설정</label>
                </div>

                {/* 제출 버튼 */}
                <div className="d-flex justify-content-center m-3">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? '로딩 중...' : '게시글 작성'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
