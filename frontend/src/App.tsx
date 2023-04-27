import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" Component={() => <Login/>} />
          <Route path="/home" Component={() => <Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
