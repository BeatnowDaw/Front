import React, { useState } from 'react';
import './LoginPage.css';
import logo2 from "../../assets/Frame 2.png";
import { Link, useNavigate } from "react-router-dom";
import CustomPopup from "../../components/Popup/CustomPopup";
import Header from "../../Layout/Header/Header";
import { signInOrRegisterWithGoogle } from "../../Model/firebaseConfig";
import LoadingPopup from "../../components/Loading/Loading";

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
    
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            const data = await response.json();
            setLoading(false);
    
            if (response.ok) {
                localStorage.setItem("token", data.token); // Guarda el token
                localStorage.setItem("role", data.role);   // Guarda el rol (admin/user)
    
                // Redirige según el rol
                if (data.role === "admin") {
                    navigate('/DashboardAdmin');
                } else {
                    navigate('/Dashboard');
                }
            } else {
                let errorMsg = 'An unknown error occurred.';
                if (!username || !password) errorMsg = 'Please fill in all fields.';
                else if (response.status >= 400 && response.status < 500) errorMsg = 'Invalid username or password.';
                else if (response.status >= 500) errorMsg = 'Server error. Please try again later.';
                
                setMessage(errorMsg);
                setShowPopup(true);
            }
        } catch (error) {
            setLoading(false);
            setMessage('Network error. Please check your connection.');
            setShowPopup(true);
        }
    };
    
    
     
    const handleClose = () => setShowPopup(false);

    function notAvailable() {
        setMessage('This feature is not available yet.');
        setShowPopup(true);
    }

    return (
        <div className="app">
            {showPopup && <CustomPopup message={message} onClose={handleClose} />}
            {loading && <LoadingPopup message={""} />}
            <Header />
            <div className="centerDiv-Login">
                <main>
                    <section className="logoSect">
                        <img className="logoPngCenter" src={logo2} alt="Logo"/>
                    </section>
                    <div className="dividerVert"></div>
                    <section className="loginContent">
                        <h2>Welcome back!</h2>
                        <p>Please sign into your account</p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" />
                            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
                            <Link className="forgotPwd" to="/forgotPwd">Forgot password?</Link>
                            <button className="submitButton" type="submit"> Sign in</button>
                            <div className="dividerHori"></div>
                            <div className="socials">
                                <button className="googleSignIn" onClick={signInOrRegisterWithGoogle} type="button">
                                    <img className="googleLogo" src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google"/>
                                </button>
                                <button className="twitterSignIn" onClick={notAvailable} type="button">
                                    <img className="twitterLogo" src="https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png" alt="Twitter"/>
                                </button>
                            </div>
                            <div className="signUpText">
                                <h6>Don't have an account? <br/> <Link className="signUp" to="/register">Sign up</Link></h6>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default LoginPage;