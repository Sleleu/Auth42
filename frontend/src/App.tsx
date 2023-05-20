import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './PrivateRoute';
import Verify2FA from './pages/Verify2FA';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/home'
          element={
          <PrivateRoute>
           <Home />
          </PrivateRoute>}/>
          <Route path="/verify-2fa" Component={Verify2FA} />
        </Routes>
      </Router>
  );
}

export default App;