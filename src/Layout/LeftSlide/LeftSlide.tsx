import React, { useState } from "react";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './LeftSlide.css';

function LeftSlide() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMenu = () => {
    if (isVisible) {
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 300); // Duration of the closing animation
    } else {
      setIsVisible(true);
    }
  };

  return (
    <div>
      <div className={`container1 ${isVisible ? 'expanded' : ''} ${isClosing ? 'closing' : ''}`}>
        <button className={`button ${isVisible ? "rotate" : ""}`} onClick={toggleMenu}>
          {isVisible ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
        </button>
        {isVisible && (
            <>
              <ul className="menu">
                <li className="menu-item slide-in"><i className="fa-solid fa-chart-column"></i><Link to="/Dashboard" style={{ textDecoration: 'none', color: 'white', width: '100%' }}>Dashboard</Link></li>
                <li className="menu-item slide-in"><i className="fa-solid fa-compass"></i><Link to="/Explore" style={{ textDecoration: 'none', color: 'white', width: '100%' }}>Explore</Link></li>
                <li className="menu-item slide-in"><i className="fa-solid fa-user"></i><Link to="/Profile" style={{ textDecoration: 'none', color: 'white', width: '100%' }}>Profile</Link></li>
                <li className="menu-item slide-in"><i className="fa-solid fa-heart"></i>Saves</li>
              </ul>
              <Link to="/Upload" className={`uploadBeat ${isVisible ? 'slide-in' : 'slide-out'}`}>Upload</Link>
            </>
        )}
      </div>
      {isVisible && <div className="dark-background" onClick={toggleMenu}></div>}
    </div>
  );
}

export default LeftSlide;
