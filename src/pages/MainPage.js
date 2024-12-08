import React from 'react';
import {MainCategory, Search, Banner} from "../components";
import './MainPage.css';

const MainPage = () => {
  return (
    <div id="main">
      <Banner />
      <Search />
      <MainCategory />
    </div>
  );
};

export default MainPage;