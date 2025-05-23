// src/components/SignUpPage.tsx

import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../Layout/Header/Header';
import UserSingleton from '../../Model/UserSingleton';
import api from '../../api/client';
import logo2 from '../../assets/Frame 2.png';
import LoadingPopup from '../../components/Loading/Loading';
import CustomPopup from '../../components/Popup/CustomPopup';
import VerifyPopup from '../../components/VerifyPopup/VerifyPopup';
import './SignUpPage.css';

const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;

export default function SignUpPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>('');
  const [showVerify, setShowVerify] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value);
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  const checkEmailAvailability = async (emailToCheck: string) => {
    if (!emailToCheck) return true;
    const resp = await api.get('/users/check-email', { params: { email: emailToCheck } });
    return resp.data.status === 'ok';
  };

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck) return true;
    const resp = await api.get('/users/check-username', { params: { username: usernameToCheck } });
    return resp.data.status === 'ok';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowLoading(true);

    let errorMsg = '';
    if (!fullName || fullName.length > 40) errorMsg = 'Please enter a full name (max 40 characters).';
    else if (!username || username.length > 16 || /\s/.test(username)) errorMsg = 'Username must be <=16 chars with no spaces.';
    else if (!email || email.length > 40 || !/\S+@\S+\.\S+/.test(email)) errorMsg = 'Please enter a valid email.';
    else if (!passwordRequirements.test(password)) errorMsg = 'Password must be 8-20 chars, include upper/lower/number/special.';
    else if (password !== confirmPassword) errorMsg = 'Passwords do not match.';

    if (errorMsg) {
      setShowLoading(false);
      setMessage(errorMsg);
      setShowPopup(true);
      return;
    }

    try {
      const emailOk = await checkEmailAvailability(email);
      if (!emailOk) throw new Error('Email taken');
      const usernameOk = await checkUsernameAvailability(username);
      if (!usernameOk) throw new Error('Username taken');
    } catch (err: any) {
      setShowLoading(false);
      setMessage(err.message === 'Email taken'
        ? 'This email is already registered.'
        : err.message === 'Username taken'
        ? 'This username is already taken.'
        : 'Availability check failed.');
      setShowPopup(true);
      return;
    }

    try {
      await api.post('/auth/register', {
        full_name: fullName,
        username,
        email,
        password,
        is_active: false,
      });

      const tokenResp = await api.post<{ access_token: string }>(
        '/token',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const accessToken = tokenResp.data.access_token;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      const meResp = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const user = UserSingleton.getInstance();
      user.setFullName(meResp.data.full_name);
      user.setUsername(meResp.data.username);
      user.setEmail(meResp.data.email);
      user.setId(meResp.data.id);
      user.setIsActive(meResp.data.is_active);

      await api.post('/mail/send-confirmation/', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setShowLoading(false);
      setShowVerify(true);
    } catch (err) {
      setShowLoading(false);
      setMessage('Registration failed. Please try again later.');
      setShowPopup(true);
    }
  };

  const handleClose = () => setShowPopup(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut', delay }
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
      {showLoading && <LoadingPopup message="" />}
      {showVerify && <VerifyPopup token={token} />}
      <Header />
      <div className="centerDiv2">
        <main>
          <motion.section
            className="registerContent"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.1}
          >
            <motion.h2 variants={fadeUp} custom={0.2}>Create New Account</motion.h2>
            <motion.p variants={fadeUp} custom={0.3}>Please fill in the form to continue</motion.p>

            <motion.form
              className="register-form"
              onSubmit={handleSubmit}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.4}
            >
              <motion.input
                type="text"
                placeholder="Full Name"
                maxLength={40}
                value={fullName}
                onChange={handleFullNameChange}
                variants={fadeUp}
                custom={0.5}
              />
              <div className="passwordInputs">
                <motion.input
                  type="text"
                  placeholder="Username"
                  maxLength={16}
                  value={username}
                  onChange={handleUsernameChange}
                  variants={fadeUp}
                  custom={0.6}
                />
                <motion.input
                  type="email"
                  placeholder="Email"
                  maxLength={40}
                  value={email}
                  onChange={handleEmailChange}
                  variants={fadeUp}
                  custom={0.7}
                />
              </div>
              <div className="passwordInputs">
                <motion.input
                  type="password"
                  placeholder="Password"
                  maxLength={20}
                  value={password}
                  onChange={handlePasswordChange}
                  variants={fadeUp}
                  custom={0.8}
                />
                <motion.input
                  type="password"
                  placeholder="Confirm Password"
                  maxLength={20}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  variants={fadeUp}
                  custom={0.9}
                />
              </div>
              <motion.button
                className="submitButton2"
                type="submit"
                variants={fadeUp}
                custom={1}
              >
                Sign up
              </motion.button>
              <motion.div
                className="signUpText"
                variants={fadeUp}
                custom={1.1}
              >
                <h6>
                  Already have an account?{' '}
                  <Link className="signIn" to="/login">Sign in</Link>
                </h6>
              </motion.div>
            </motion.form>
          </motion.section>

          <div className="dividerVert2" />

          <motion.section
            className="logoSect2"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.2}
          >
            <motion.img
              className="logoPngCenter2"
              src={logo2}
              alt="Logo"
              variants={float}
              animate="animate"
            />
          </motion.section>
        </main>
      </div>
    </div>
  );
}
