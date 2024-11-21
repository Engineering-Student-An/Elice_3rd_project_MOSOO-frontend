import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const App = () => {
  return (
      <Router>
        <div id="root">
            <main className="flex-grow-1">
            <Routes>
            </Routes>
          </main>
            <h1>모수 화이팅</h1>
        </div>
      </Router>
  );
};

export default App;
