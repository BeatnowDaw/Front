// src/components/SignUpPage.tsx

import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  // Check availability via API
  const checkEmailAvailability = async (emailToCheck: string) => {
    if (!emailToCheck) return true;
    try {
      const resp = await api.get<{ status: string; detail: string }>('/users/check-email', { params: { email: emailToCheck } });
      console.log('Email check:', resp.data);
      return resp.data.status === 'ok';
    } catch (err: any) {
      console.error('Error checking email:', err);
      throw new Error('Error checking email availability');
    }
  };

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck) return true;
    try {
      const resp = await api.get<{ status: string; detail: string }>('/users/check-username', { params: { username: usernameToCheck } });
      console.log('Username check:', resp.data);
      return resp.data.status === 'ok';
    } catch (err: any) {
      console.error('Error checking username:', err);
      throw new Error('Error checking username availability');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowLoading(true);
    let errorMsg = '';
    // Client-side validations
    if (!fullName || fullName.length > 40) {
      errorMsg = 'Please enter a full name (max 40 characters).';
    } else if (!username || username.length > 16 || /\s/.test(username)) {
      errorMsg = 'Username must be <=16 chars with no spaces.';
    } else if (!email || email.length > 40 || !/\S+@\S+\.\S+/.test(email)) {
      errorMsg = 'Please enter a valid email (max 40 characters).';
    } else if (!passwordRequirements.test(password)) {
      errorMsg = 'Password must be 8-20 chars and include uppercase, lowercase, number, and special character.';
    } else if (password !== confirmPassword) {
      errorMsg = 'Passwords do not match.';
    }

    if (errorMsg) {
      setShowLoading(false);
      setMessage(errorMsg);
      setShowPopup(true);
      return;
    }

    // Server-side availability checks
    try {
      const emailOk = await checkEmailAvailability(email);
      if (!emailOk) throw new Error('Email taken');
      const usernameOk = await checkUsernameAvailability(username);
      if (!usernameOk) throw new Error('Username taken');
    } catch (err: any) {
      setShowLoading(false);
      if (err.message === 'Email taken') setMessage('This email is already registered.');
      else if (err.message === 'Username taken') setMessage('This username is already taken.');
      else setMessage(err.message || 'Availability check failed.');
      setShowPopup(true);
      return;
    }

    // Registration
    try {
      await api.post('/auth/register', {
        full_name: fullName,
        username,
        email,
        password,
        is_active: false,
      });
      // Get token
      const tokenResp = await api.post<{ access_token: string }>('/token', new URLSearchParams({ username, password }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const accessToken = tokenResp.data.access_token;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      // Fetch de /users/me** para popular el UserSingleton
      const meResp = await api.get<UserData>('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const user = UserSingleton.getInstance();
      user.setFullName(meResp.data.full_name);
      user.setUsername(meResp.data.username);
      user.setEmail(meResp.data.email);
      user.setId(meResp.data.id);
      user.setIsActive(meResp.data.is_active);  

      // Send confirmation email
      await api.post('/mail/send-confirmation/', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShowLoading(false);
      setShowVerify(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setShowLoading(false);
      setMessage('Registration failed. Please try again later.');
      setShowPopup(true);
    }
  };

  const handleClose = () => setShowPopup(false);

  return (
    <div className="app">
      {showPopup && <CustomPopup message={message} onClose={handleClose} />}
      {showLoading && <LoadingPopup message="" />}      
      {showVerify && <VerifyPopup token={token} />}
      <Header />
      <div className="centerDiv2">
        <main>
          <section className="registerContent">
            <h2>Create New Account</h2>
            <p>Please fill in the form to continue</p>
            <form className="register-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                maxLength={40}
                value={fullName}
                onChange={handleFullNameChange}
              />
              <div className="passwordInputs">
                <input
                  type="text"
                  placeholder="Username"
                  maxLength={16}
                  value={username}
                  onChange={handleUsernameChange}
                />
                <input
                  type="email"
                  placeholder="Email"
                  maxLength={40}
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="passwordInputs">
                <input
                  type="password"
                  placeholder="Password"
                  maxLength={20}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  maxLength={20}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              <button className="submitButton2" type="submit">Sign up</button>
              <div className="signUpText">
                <h6>
                  Already have an account?{' '}
                  <Link className="signIn" to="/login">Sign in</Link>
                </h6>
              </div>
            </form>
          </section>
          <div className="dividerVert2" />
          <section className="logoSect2">
            <img className="logoPngCenter2" src={logo2} alt="Logo" />
          </section>
        </main>
      </div>
    </div>
  );
}
