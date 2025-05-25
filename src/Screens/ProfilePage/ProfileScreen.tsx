import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import UserSingleton from "../../Model/UserSingleton";
import api from '../../api/client';
import beat1 from "../../../public/beat1.png";
import CustomPopup from "../../components/Popup/CustomPopup";
import styles from "./ProfileScreen.module.css";

const mockPosts = [
  { _id: "1", title: "Dano Type Beat", publication_date: "2023-05-01", views: "18.6K" },
  { _id: "2", title: "Kanye West Type Beat", publication_date: "2023-05-02", views: "794.2K" },
  { _id: "3", title: "Delaossa Type Beat", publication_date: "2023-05-03", views: "3.1M" },
  { _id: "4", title: "Sticky M.A. Type Beat", publication_date: "2023-05-04", views: "1.5M" },
  { _id: "5", title: "C.Tangana Type Beat", publication_date: "2023-05-05", views: "2.9M" },
];

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      const username = UserSingleton.getInstance().getUsername();

      if (!token || !username) {
        setMessage("Session has expired, redirecting to landing page.");
        setShowPopup(true);
        localStorage.removeItem("token");
        return;
      }

      try {
        await api.get(`/users/me`, {
          headers: { accept: "application/json", Authorization: `Bearer ${token}` },
        });
        setLoading(false);
      } catch {
        setShowPopup(true);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return (
<div className={`app ${styles.profilePage}`}>
      {showPopup && <CustomPopup message={message} onClose={() => window.location.href = "/"} />}
      <Header />
      <LeftSlide />

      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <img src={beat1} alt="Profile avatar" className={styles.profileAvatar} />
          <div className={styles.profileInfo}>
            <h2>@hugogarsan <span className={styles.verified}>✔</span></h2>
            <div className={styles.actions}>
              <button className={styles.followBtn}>Seguir</button>
              <button className={styles.messageBtn}>Mensaje</button>
            </div>
            <p className={styles.stats}>857 Siguiendo · 150 Seguidores · 4152 Me gusta</p>
            <p className={styles.bio}>Productor de beats. 🔊</p>
          </div>
        </div>

        <div className={styles.tabs}>
          <span className={`${styles.tab} ${styles.active}`}>Vídeos</span>
          <span className={styles.tab}>Compartidos</span>
          <span className={styles.tab}>Me gusta</span>
        </div>

        <div className={styles.feedContent}>
          {loading ? (
            <p className={styles.loadingMessage}>Cargando publicaciones...</p>
          ) : (
            <div className={styles.videoGrid}>
              {mockPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  className={styles.videoCard}
                  layoutId={`post-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.videoWrapper}>
                    <img src={beat1} alt={post.title} className={styles.videoThumbnail} />
                    <span className={styles.videoViews}>▶ {post.views}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
