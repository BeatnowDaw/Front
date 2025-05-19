import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerificationInput from 'react-verification-input';
import api from '../../api/client';
import './VerifyPopup.css';

interface VerifyPopupProps {
  token?: string;
}

const VerifyPopup: React.FC<VerifyPopupProps> = ({ token: propToken }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const token = propToken || localStorage.getItem('token') || '';
  if (!token) {
    console.error('No token available for verification');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        '/mail/confirmation/',
        {},
        {
          params: { code: verificationCode },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Code verified successfully');
      handleClose();
      navigate('/Dashboard', { state: { token } });
    } catch (error: any) {
      console.error('Failed to verify code:', error.response?.data || error.message);
    }
  };

  const resendCode = async () => {
    try {
      await api.post(
        '/mail/send-confirmation/',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Code resent successfully');
    } catch (error: any) {
      console.error('Failed to resend code:', error.response?.data || error.message);
    }
  };

  return (
    <div className={`verify-popup ${isVisible ? 'visible' : ''}`}>
      <div className="verify-popup-content">
        <form className="verification-form" onSubmit={handleSubmit}>
          <div className="verification-texts">
            <h3>A verification code has been sent</h3>
            <h5>Please check your email and input your code to complete registration:</h5>
          </div>
          <div className="verification-inputs">
            <VerificationInput
              length={6}
              validChars="0-9"
              onChange={setVerificationCode}
              value={verificationCode}
              autoFocus
            />
          </div>
          <button className="resend-button" type="button" onClick={resendCode}>
            Resend code
          </button>
          <button className="submit-verify" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPopup;