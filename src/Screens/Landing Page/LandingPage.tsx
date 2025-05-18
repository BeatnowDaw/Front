// src/components/LandingPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Layout/Header/Header';
import logo from '../../assets/Logo.png';
import studio from '../../assets/Studio 2.jpeg';
import qr from '../../assets/qrbeatnow.png';
import './LandingPage.css';

function Landing() {
  const [mobileDisplay, setMobileDisplay] = useState(false);

  // Detect mobile layout
  useEffect(() => {
    const handleResize = () => setMobileDisplay(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    // initial
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL; // e.g. http://localhost:8001/v1/api
    if (!baseUrl) {
      console.error('REACT_APP_API_BASE_URL is not defined');
      return;
    }
    window.open(`${baseUrl}/download/android-apk/`);
  };

  return (
    <div className="app">
      <Header />

      <div className="centerDiv">
        <main>
          <section className="studio-image">
            <img className="studio-image-PNG" src={studio} alt="Studio" />
          </section>

          <section className="contentLanding">
            <div className="intro">
              <h1>Welcome to <b>BeatNow</b></h1>
              {mobileDisplay ? (
                <div className="dl-btn-div">
                  <h3>Click to download the app:</h3>
                  <button
                    className="dl-btn"
                    onClick={handleDownload}
                    title="Click to download the app"
                  >
                    <img src={logo} className="btn-pic" alt="Download logo" />
                  </button>
                </div>
              ) : (
                <div className="qr-div">
                  <h3>Scan the code to download the app:</h3>
                  <div
                    className="qr-frame"
                    onClick={handleDownload}
                    title="Click to download the app"
                  >
                    <img className="qr-pic" src={qr} alt="QR code" />
                  </div>
                </div>
              )}
            </div>

            <div className="tryDiv">
              <h4 className="h4-landing">
                Wanna try?{' '}
                <Link className="buttonSignUp" to="/register">
                  Sign up now
                </Link>
              </h4>

              <h6>
                Already have an account? <br />
                <Link className="LogIn" to="/login">
                  Sign in
                </Link>
              </h6>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Landing;
