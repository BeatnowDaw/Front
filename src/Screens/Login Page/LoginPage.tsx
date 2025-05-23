// src/components/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

      setLoading(false);
      if (!userResp.data.is_active) {
        setShowVerifyPopup(true);
      } else {
        navigate('/dashboard', { state: { token: data.access_token } });
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

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        delay
      }
    })
  };

  const float = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity
      }
    }
  };

  return (
    <div className="app">
      {showPopup && <CustomPopup message={message} onClose={handleClose} />}
      {loading && <LoadingPopup message="" />}
      {showVerifyPopup && token && <VerifyPopup token={token} />}
      <Header />

      <div className="centerDiv-Login">
        <main>
          <motion.section
            className="logoSect"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.2}
          >
            <motion.img
              className="logoPngCenter"
              src={logo2}
              alt="Logo"
              variants={float}
              animate="animate"
            />
          </motion.section>

          <div className="dividerVert" />

          <motion.section
            className="loginContent"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.3}
          >
            <motion.h2 variants={fadeUp} custom={0.3}>Welcome back!</motion.h2>
            <motion.p variants={fadeUp} custom={0.4}>Please sign into your account</motion.p>

            <motion.form
              className="login-form"
              onSubmit={handleSubmit}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.5}
            >
              <motion.input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Username"
                variants={fadeUp}
                custom={0.6}
              />
              <motion.input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                variants={fadeUp}
                custom={0.7}
              />
              <Link className="forgotPwd" to="/forgotPwd">
                Forgot password?
              </Link>
              <motion.button
                className="submitButton"
                type="submit"
                variants={fadeUp}
                custom={0.8}
              >
                Sign in
              </motion.button>

              <div className="dividerHori" />

              <motion.div
                className="socials"
                variants={fadeUp}
                custom={0.9}
              >
                <button className="googleSignIn" onClick={signInOrRegisterWithGoogle} type="button">
                  <img
                    className="googleLogo"
                    src="https://th.bing.com/th/id/OIP.HgH-NjiOdFOrkmwjsZCCfAHaHl?w=166&h=180&c=7&r=0&o=5&pid=1.7"
                    width={40}
                    alt="Google"
                  />
                </button>
                <button className="twitterSignIn" onClick={notAvailable} type="button">
                  <img
                    className="twitterLogo"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png"
                    alt="Twitter"
                  />
                </button>
              </motion.div>

              <motion.div
                className="signUpText"
                variants={fadeUp}
                custom={1}
              >
                <h6>
                  Don't have an account? <br />
                  <Link className="signUp" to="/register">
                    Sign up
                  </Link>
                </h6>
              </motion.div>
            </motion.form>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
