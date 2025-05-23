// src/components/LandingPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../Layout/Header/Header';
import logo from '../../assets/Logo.png';
import studio from '../../assets/Studio 2.jpeg';
import qr from '../../assets/qrbeatnow.png';
import './LandingPage.css';

function Landing() {
  const [mobileDisplay, setMobileDisplay] = useState(false);

  useEffect(() => {
    const handleResize = () => setMobileDisplay(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    if (!baseUrl) {
      console.error('REACT_APP_API_BASE_URL is not defined');
      return;
    }
    window.open(`${baseUrl}/download/android-apk/`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay,
      },
    }),
  };

  const float = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="app">
      <Header />

      <div className="centerDiv">
        <main>
          <section className="studio-image">
            <motion.img
              className="studio-image-PNG"
              src={studio}
              alt="Studio"
              width={600}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            />
          </section>

          <section className="contentLanding">
            <motion.div
              className="intro"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.1}
            >
              <motion.h1 variants={fadeUp} custom={0.2}>
                Welcome to <b>BeatNow</b>
              </motion.h1>

              <motion.h3 variants={fadeUp} custom={0.3}>
                {mobileDisplay
                  ? 'Click to download the app:'
                  : 'Scan the code to download the app:'}
              </motion.h3>
            </motion.div>

            {mobileDisplay ? (
              <motion.div
                className="dl-btn-div"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.4}
              >
                <button
                  className="dl-btn"
                  onClick={handleDownload}
                  title="Click to download the app"
                >
                  <motion.img
                    src={logo}
                    className="btn-pic"
                    alt="Download logo"
                    variants={float}
                    animate="animate"
                  />
                </button>
              </motion.div>
            ) : (
              <motion.div
                className="qr-div"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.4}
              >
                <div
                  className="qr-frame"
                  onClick={handleDownload}
                  title="Click to download the app"
                >
                  <motion.img
                    className="qr-pic"
                    src={qr}
                    alt="QR code"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              className="tryDiv"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
            >
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
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Landing;
