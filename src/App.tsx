// src/App.tsx

// APIS: http://217.182.70.161:6969/docs#/

import { useEffect, useRef, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from "./Screens/DashboardPage/Dashboard";
import ForgotPwdPage from "./Screens/ForgotPwd Page/ForgotPwdPage";
import Home from './Screens/HomePage/HomePage';
import Landing from "./Screens/Landing Page/LandingPage";
import LoginPage from './Screens/Login Page/LoginPage';
import SignUpPage from "./Screens/Sign Up Page/SignUpPage";
import Upload from "./Screens/UploadScreens/Upload";
import VideoPageContainer from './Screens/VideoPage/VideoPageContainer';
import CustomPopup from './components/Popup/CustomPopup';

const CheckToken = () => {
    const timeout = 3000;
    const location = useLocation();
    const [showPopup, setShowPopup] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const logout = () => {
        localStorage.removeItem("token");
        setShowPopup(true);
    }

    const checkToken = () => {
        intervalRef.current = window.setInterval(() => {
            if (localStorage.getItem("token") === null) {
                logout();
            }
        }, timeout);
    }

    useEffect(() => {
        if (location.pathname !== "/" &&
            location.pathname !== "/login" &&
            location.pathname !== "/register" &&
            location.pathname !== "/forgotPwd") {
            checkToken();
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [location]);

    return (
        <>
            {showPopup && <CustomPopup message="Session has expired, redirecting to landing page." onClose={() => window.location.href = "/"} />}
        </>
    );
}

function App() {
    return (
        <Router>
            <CheckToken />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="*" element={<Landing />} />
                <Route path="/Upload" element={<Upload />} />
                <Route path={"/Dashboard"} element={<Dashboard />} />
                <Route path={"/ForgotPwd"} element={<ForgotPwdPage />} />
                <Route path={"/"} element={<Landing />} />
                <Route path={"/Home"} element={<Home />} />
                <Route path="/video/:id" element={<VideoPageContainer />} />
            </Routes>
        </Router>
    );
}

export default App;