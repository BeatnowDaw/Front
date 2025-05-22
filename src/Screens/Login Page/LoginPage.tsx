// src/components/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header/Header';
import UserSingleton from '../../Model/UserSingleton';
import { signInOrRegisterWithGoogle } from '../../Model/firebaseConfig';
import api from '../../api/client';
import logo2 from '../../assets/Frame 2.png';
import LoadingPopup from '../../components/Loading/Loading';
import CustomPopup from '../../components/Popup/CustomPopup';
import VerifyPopup from '../../components/VerifyPopup/VerifyPopup';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);



  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams({ username, password });
      const resp = await api.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const data = resp.data;
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);

      // Fetch user info
      const userResp = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      
      const userData: UserData = {
        ...userResp.data,
        id: userResp.data.id

      };
      
      const user = UserSingleton.getInstance();
      user.setFullName(userData.full_name);
      user.setUsername(userData.username);
      user.setEmail(userData.email);
      user.setId(userData.id);
      user.setIsActive(userData.is_active);
      console.log(user.getId());
      // Puedes continuar con otros setters si tu singleton los tiene:
      

      setLoading(false);
      if (!userResp.data.is_active) {
        setShowVerifyPopup(true);
      } else {
        navigate('/Dashboard', { state: { token: data.access_token } });
      }
    } catch (err: any) {
      setLoading(false);
      const status = err.response?.status;
      if (!username || !password) {
        setMessage('Please fill in all fields.');
      } else if (status && status >= 400 && status < 500) {
        setMessage('Invalid username or password.');
      } else {
        setMessage('An error occurred. Please try again later.');
      }
      setShowPopup(true);
    }
  };

  const handleClose = () => setShowPopup(false);
  const notAvailable = () => {
    setMessage('This feature is not available yet.');
    setShowPopup(true);
  };

  return (
    <div className="app">
      {showPopup && <CustomPopup message={message} onClose={handleClose} />}
      {loading && <LoadingPopup message="" />}
      {showVerifyPopup && token && <VerifyPopup token={token} />}
      <Header />
      <div className="centerDiv-Login">
        <main>
          <section className="logoSect">
            <img className="logoPngCenter" src={logo2} alt="Logo" />
          </section>
          <div className="dividerVert" />
          <section className="loginContent">
            <h2>Welcome back!</h2>
            <p>Please sign into your account</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Username"
              />
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
              />
              <Link className="forgotPwd" to="/forgotPwd">
                Forgot password?
              </Link>
              <button className="submitButton" type="submit">
                Sign in
              </button>
              <div className="dividerHori" />
              <div className="socials">
                <button
                  className="googleSignIn"
                  onClick={signInOrRegisterWithGoogle}
                  type="button"
                >
                  <img
                    className="googleLogo"
                    src="https://commons.wikimedia.org/wiki/File:Google.png"
                    alt="Google"
                  />
                </button>
                <button
                  className="twitterSignIn"
                  onClick={notAvailable}
                  type="button"
                >
                  <img
                    className="twitterLogo"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png"
                    alt="Twitter"
                  />
                </button>
              </div>
              <div className="signUpText">
                <h6>
                  Don't have an account? <br />
                  <Link className="signUp" to="/register">
                    Sign up
                  </Link>
                </h6>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;