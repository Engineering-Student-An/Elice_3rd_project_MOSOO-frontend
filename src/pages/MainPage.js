import React from 'react';
import {Category, Search} from "../components";
import './MainPage.css';

const MainPage = () => {
  return (
    <div id="root">
      <Search />
      <Category />
    </div>
  );
};

export default MainPage;