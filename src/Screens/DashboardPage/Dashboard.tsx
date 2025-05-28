import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import UserSingleton from "../../Model/UserSingleton";
import api from '../../api/client';

import CardDetails from "../../components/CardDetails/CardDetails";

import CustomPopup from "../../components/Popup/CustomPopup";
import "./Dashboard.css";

interface Post {
  _id: string;
  title: string;
  publication_date: string;
  likes: number;
  saves: number;
  tags: string[];
  genre: string;
  moods: string[];
  instruments: string[];
  bpm: number;
  user_id: string;
  audio_format: string;
  cover_format: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL!;
const STATIC_BASE = API_BASE.replace(/\/v1\/api\/?$/, '');

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay }
  }),
};

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [popupMode, setPopupMode] = useState<"session" | "delete" | null>(null);

  // Obtiene posts del usuario
  useEffect(() => {
    const username = UserSingleton.getInstance().getUsername();
    const token = localStorage.getItem("token");
    api.get(`/users/posts/${username}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setPosts(res.data);
        setPopularPosts([...res.data].sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves)));
      })
      .catch(err => console.error(err));
  }, []);

  // Verifica sesión
  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get(`/users/me`, { headers: { accept: "application/json", Authorization: `Bearer ${token}` } })
      .catch(() => {
        setMessage("Session has expired, redirecting to landing page.");
        setPopupMode("session");
        setShowPopup(true);
      });
  }, []);

  // Reloj
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Comprueba username
  function checkUsername() {
    if (!UserSingleton.getInstance().getUsername()) {
      setMessage("Session has expired, redirecting to landing page.");
      setPopupMode("session");
      setShowPopup(true);
    }
  }

  // Click en papelera
  const onDeleteClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostToDelete(postId);
    setMessage("¿Estás seguro de que quieres eliminar esta publicación?");
    setPopupMode("delete");
    setShowPopup(true);
  };

  // Confirmar borrado
  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/posts/${postToDelete}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (res.ok) setPosts(prev => prev.filter(p => p._id !== postToDelete));
      else console.error(await res.text());
    } catch (err) { console.error(err); }
    finally {
      setShowPopup(false);
      setPostToDelete(null);
    }
  };

  // Cancelar borrado
  const cancelDelete = () => {
    setShowPopup(false);
    setPostToDelete(null);
  };

  // Cerrar sesión desde popup
  const closeSessionPopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div className="app">
      <AnimatePresence>
        {showPopup && popupMode === "session" && (
          <CustomPopup message={message} onClose={closeSessionPopup} />
        )}
        {showPopup && popupMode === "delete" && (
          <CustomPopup message={message} onConfirm={confirmDelete} onCancel={cancelDelete} />
        )}
      </AnimatePresence>

      <Header />
      <div className="leftSlide"><LeftSlide /></div>
      <div className="content">
        <div className="dash-header">
          <h1 className="home">{UserSingleton.getInstance().getUsername()}'s dashboard</h1>
          <button className="uploadButton" onClick={() => navigate("/Upload")}>+</button>
          <h1 className="rt-clock">{currentTime.toLocaleTimeString('en-US',{hour12:false})}</h1>
        </div>

        {!posts.length ? (
          <motion.h2 className="empty-dashboard-msg" variants={fadeUp} initial="hidden" animate="visible">
            Your dashboard looks empty...<br/>Try uploading some beats!
          </motion.h2>
        ) : (
          <>
            <div className="section-container">
              <motion.h3 variants={fadeUp}>Your Uploads</motion.h3>
              <div className="cards-container">
                {posts.map((post, i) => (
                  <motion.div key={post._id}
                    className={`card ${selectedLayoutId===`post-${i}`?'hidden':''}`}
                    layoutId={`post-${i}`}
                    onClick={() => { setSelectedPostId(post._id); setSelectedLayoutId(`post-${i}`); }}
                    initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} exit={{opacity:0,y:50}} transition={{duration:0.3}}
                  >
                    <button className="delete-btn" onClick={e => onDeleteClick(post._id,e)} aria-label="Eliminar publicación">🗑️</button>
                    <button className="card-play-btn" onClick={e=>{e.stopPropagation();navigate(`/video/${post._id}`);}}>▶</button>
                    <img className="post-picture" src={`http://127.0.0.1/beatnow/${UserSingleton.getInstance().getId()}/posts/${post._id}/caratula.${post.cover_format}`} alt="Post" />
                    <h4><b>{post.title}</b></h4>
                    <p>{new Date(post.publication_date).toLocaleDateString()}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedPostId && selectedLayoutId && (
          <CardDetails
            post={posts.find(p => p._id === selectedPostId)!}
            image={`http://127.0.0.1/beatnow/${UserSingleton.getInstance().getId()}/posts/${selectedPostId}/caratula.${posts.find(p=>p._id===selectedPostId)!.cover_format}`}
            audio={`http://127.0.0.1/beatnow/${UserSingleton.getInstance().getId()}/posts/${selectedPostId}/audio.${posts.find(p=>p._id===selectedPostId)!.audio_format}`}
            layoutId={selectedLayoutId}
            onClose={() => { setSelectedPostId(null); setSelectedLayoutId(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;