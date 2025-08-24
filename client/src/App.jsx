import React, { useEffect, useContext } from 'react';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import LoginForm from './Pages/LoginForm';
import SignUpForm from './Pages/SignUpForm';
import ForgotPasswordForm from './Pages/ForgotPasswordForm';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider, AppContent } from './context/AppContext';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

function AppRoutes() {
  const { setUserData, setIsLoggedIn, backendUrl } = useContext(AppContent);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  axios.defaults.withCredentials = true;

  axios.get(`${backendUrl}/auth/me`)
    .then(res => {
      setUserData(res.data);
      setIsLoggedIn(true);
    })
    .catch(() => {
      setUserData(null);
      setIsLoggedIn(false);
    });
}, []);



  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
        {/* future routes add here */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
