import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import UserSingleton from "../../Model/UserSingleton";
import api from "../../api/client";
import CustomPopup from "../../components/Popup/CustomPopup";
import styles from "./ProfileScreen.module.css";
import beat1 from "../../../public/beat1.png"; // imagen temporal para beats

interface Beat {
  _id: string;
  title: string;
  publication_date: string;
  views: number;
  cover_format: string;
}

interface UserProfile {
  username: string;
  avatar?: string;
  followers: number;
  following: number;
  likes: number;
  bio: string;
  posts: Beat[];
}

function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token || !userId) {
        setMessage("Session has expired or user not found.");
        setShowPopup(true);
        localStorage.removeItem("token");
        return;
      }

      try {
        const res = await api.get(`/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("Failed to load profile.");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div className={`app ${styles.profilePage}`}>
      {showPopup && <CustomPopup message={message} onClose={() => navigate("/")} />}
      <Header />
      <LeftSlide />

      <div className={styles.profileContainer}>
        {profileData && (
          <>
            <div className={styles.profileHeader}>
              <img src={profileData.avatar || beat1} alt="Avatar" className={styles.profileAvatar} />
              <div className={styles.profileInfo}>
                <h2>@{profileData.username} <span className={styles.verified}>✔</span></h2>
{profileData.username !== UserSingleton.getInstance().getUsername() && (
  <div className={styles.actions}>
    <button className={styles.followBtn}>Seguir</button>
    <button className={styles.messageBtn}>Mensaje</button>
  </div>
)}

                <p className={styles.stats}>
                  {profileData.following} Siguiendo · {profileData.followers} Seguidores · {profileData.likes} Me gusta
                </p>
                <p className={styles.bio}>{profileData.bio}</p>
              </div>
            </div>

            <div className={styles.tabs}>
              <span className={`${styles.tab} ${styles.active}`}>Vídeos</span>
              <span className={styles.tab}>Compartidos</span>
              <span className={styles.tab}>Me gusta</span>
            </div>
          </>
        )}

        <div className={styles.feedContent}>
          {loading ? (
            <p className={styles.loadingMessage}>Cargando publicaciones...</p>
          ) : (
            <div className={styles.videoGrid}>
              {profileData?.posts?.map((post, index) => (
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
                    <img
                      src={`http://localhost:8001/beatnow/${userId}/posts/${post._id}/caratula.${post.cover_format}`}
                      alt={post.title}
                      className={styles.videoThumbnail}
                      onError={(e) => (e.currentTarget.src = beat1)}
                    />
                    <span className={styles.videoViews}>▶ {post.views?.toLocaleString() ?? "0"}</span>
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
