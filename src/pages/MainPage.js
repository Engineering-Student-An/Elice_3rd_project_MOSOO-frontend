import React from 'react';
import {MainCategory, Search} from "../components";
import './MainPage.css';

const MainPage = () => {
  return (
    <div id="main">
      <Search />
      <MainCategory />
    </div>
  );
};

export default MainPage;