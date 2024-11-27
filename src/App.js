import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Header, Footer } from "./fragments";

const App = () => {
  return (
      <Router>
        <div id="root">
            <Header />
            <main className="flex-grow-1">
                <Routes>
                </Routes>
            </main>
            <Footer />
        </div>
      </Router>
  );
};

export default App;
