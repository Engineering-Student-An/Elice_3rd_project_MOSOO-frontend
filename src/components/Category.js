import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // 대분류 조회 API 호출
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/category/first_category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="categories">
      <div className="container">
        <div className="cat-inner">
          <div className="row">
            <div className="col-12 p-0">
              <div className="category-slider">
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <a href="#" className="single-cat" key={index}>
                      <div className="icon">
                        <img src={category.icon} alt={category.name} />
                      </div>
                      <h3>{category.name}</h3>
                      <h5 className="total">{category.total}</h5>
                    </a>
                  ))
                ) : (
                  <p>카테고리를 불러오는 중입니다...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;