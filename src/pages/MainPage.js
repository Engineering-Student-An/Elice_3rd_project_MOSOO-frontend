import React from 'react';
import {Category, Search} from "../components";
import './MainPage.css';

const MainPage = () => {
  return (
    <div id="main">
      <Search />
      <Category />
    </div>
  );
};

export default MainPage;