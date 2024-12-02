import React from 'react';

const categories = [];

const Category = () => {
  return (
    <section className="categories">
      <div className="container">
        <div className="cat-inner">
          <div className="row">
            <div className="col-12 p-0">
              <div className="category-slider">
                {categories.map((category, index) => (
                  <a href="category.html" className="single-cat" key={index}>
                    <div className="icon">
                      <img
                        src={`assets/images/categories/${category.icon}`}
                        alt={category.name}
                      />
                    </div>
                    <h3>{category.name}</h3>
                    <h5 className="total">{category.total}</h5>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;
