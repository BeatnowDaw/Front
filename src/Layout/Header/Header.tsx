import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import UserSingleton from "../../Model/UserSingleton";
import CustomPopup from "../../components/Popup/CustomPopup";
import { motion, AnimatePresence } from "framer-motion";

import "./Header.css";

const dropdownVariants = {
  open: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto" as const,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  closed: {
    opacity: 0,
    y: -10,
    pointerEvents: "none" as const,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const floatingLogo = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

function Header() {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const user = UserSingleton.getInstance();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("token");
    UserSingleton.getInstance().clear();
    window.location.href = "/";
  };

  const notAvailable = () => {
    setMessage("This feature is not available yet.");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const token = localStorage.getItem("token");

  return (
    <header className="header">
      <div className="logo">
        {token === null ? (
          <Link to="/">
            <motion.img
              className="logoPng"
              src={logo}
              alt="Logo"
              variants={floatingLogo}
              animate="animate"
            />
          </Link>
        ) : (
          <Link to="/dashboard">
            <motion.img
              className="logoPng"
              src={logo}
              alt="Logo"
              variants={floatingLogo}
              animate="animate"
            />
          </Link>
        )}
      </div>

      {token === null ? (
        <Link className="buttonSignUp" to="/register">
          Sign up
        </Link>
      ) : (
        <div className="nav-links">
          <div className="profile" onClick={toggleDropdown} ref={dropdownRef}>
            <img src={user.photoProfile} alt="Profile" />
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="dropdown-content"
                  key="dropdown"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={dropdownVariants}
                >
                  <a onClick={notAvailable}>Perfil</a>
                  <a onClick={notAvailable}>Ajustes</a>
                  <a onClick={handleLogout}>Cerrar sesión</a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {showPopup && <CustomPopup message={message} onClose={closePopup} />}
    </header>
  );
}

export default Header;
