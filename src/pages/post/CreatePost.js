import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {
    fetchCategories,
    fetchSubCategoriesLevel1,
    fetchSubCategoriesLevel2,
    createPost,
} from './CreatePostApi';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategoriesLevel1, setSubCategoriesLevel1] = useState([]);
    const [subCategoriesLevel2, setSubCategoriesLevel2] = useState([]);
    const [selectedParentCategory, setSelectedParentCategory] = useState('');
    const [selectedSubCategory1, setSelectedSubCategory1] = useState('');
    const [selectedSubCategory2, setSelectedSubCategory2] = useState('');
    const [isOffer, setIsOffer] = useState(false);
    const [userId] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (selectedParentCategory) {
            const loadSubCategoriesLevel1 = async () => {
                try {
                    const data = await fetchSubCategoriesLevel1(selectedParentCategory);
                    setSubCategoriesLevel1(data);
                    setSubCategoriesLevel2([]);
                    setSelectedSubCategory1('');
                    setSelectedSubCategory2('');
                } catch (err) {
                    setError(err.message);
                }
            };
            loadSubCategoriesLevel1();
        }
    }, [selectedParentCategory]);

    useEffect(() => {
        if (selectedSubCategory1) {
            const loadSubCategoriesLevel2 = async () => {
                try {
                    const data = await fetchSubCategoriesLevel2(selectedSubCategory1);
                    setSubCategoriesLevel2(data);
                    setSelectedSubCategory2('');
                } catch (err) {
                    setError(err.message);
                }
            };
            loadSubCategoriesLevel2();
        }
    }, [selectedSubCategory1]);

    const handleImageChange = (event) => {
        setImages(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !description || !price || !duration || !selectedSubCategory2) {
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
        formData.append('categoryId', selectedSubCategory2);

        for (let i = 0; i < images.length; i++) {
            formData.append('imageUrls', images[i]);
        }

        try {
            const data = await createPost(formData);
            console.log('게시글 생성 성공:', data);

            navigate(isOffer ? '/offerPosts' : '/requestPosts');
        } catch (err) {
            setError(err.message);
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
                    {/* 왼쪽 설명 영역 */}
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
                        <div className="mb-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="제목"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <textarea
                                className="form-control"
                                placeholder="설명"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="가격"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="text"
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
                    <h5>카테고리 선택</h5>
                    <p>대분류, 중분류, 소분류를 순서대로 선택하세요.</p>
                    <select
                        className="form-select mb-3"
                        value={selectedParentCategory}
                        onChange={(e) => setSelectedParentCategory(e.target.value)}
                    >
                        <option value="">대분류 선택</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select mb-3"
                        value={selectedSubCategory1}
                        onChange={(e) => setSelectedSubCategory1(e.target.value)}
                    >
                        <option value="">중분류 선택</option>
                        {subCategoriesLevel1.map((subCategory) => (
                            <option key={subCategory.categoryId} value={subCategory.categoryId}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select mb-3"
                        value={selectedSubCategory2}
                        onChange={(e) => setSelectedSubCategory2(e.target.value)}
                    >
                        <option value="">소분류 선택</option>
                        {subCategoriesLevel2.map((subCategory) => (
                            <option key={subCategory.categoryId} value={subCategory.categoryId}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 이미지 업로드 */}
                <div className="mb-5">
                    <h5>이미지</h5>
                    <input
                        type="file"
                        className="form-control"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>

                {/* 고수 글 체크 */}
                <div className="form-check mb-5">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isOffer}
                        onChange={() => setIsOffer(!isOffer)}
                    />
                    <label className="form-check-label">고수 글 게시</label>
                </div>

                <button type="submit" className="btn btn-primary m-3" disabled={loading}>
                    {loading ? '게시글 생성 중...' : '게시글 작성'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
