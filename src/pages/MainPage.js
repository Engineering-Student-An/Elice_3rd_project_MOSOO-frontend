import React from 'react';
import {Category, Search} from "../components"; 

const MainPage = () => {
  return (
    <div id="root">
      <Search />
      <Category />
    </div>
  );
};

export default MainPage;