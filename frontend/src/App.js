import React from 'react';
import './App.css';
import MainWrapper from 'components/Main/Main';
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MainWrapper />
    </BrowserRouter>
  );
}

export default App;
