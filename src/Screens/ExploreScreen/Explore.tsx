// Explore.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import UserSingleton from "../../Model/UserSingleton";
import api from '../../api/client';
import CardDetails from "../../components/CardDetails/CardDetails";
import CustomPopup from "../../components/Popup/CustomPopup";
import styles from './Explore.module.css';

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
const POST_TARGET_COUNT = 12;

function Explore() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [popularPosts, setPopularPosts] = useState<Post[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const username = UserSingleton.getInstance().getUsername();
        const token = localStorage.getItem("token");

        if (!username) {
            setMessage("Session has expired, redirecting to landing page.");
            setShowPopup(true);
            return;
        }

        const fixArrayField = (field: string[]) => {
            try {
                return Array.isArray(field) && field.length > 0 ? JSON.parse(field[0]) : [];
            } catch {
                return [];
            }
        };

        const fetchMultiplePosts = async () => {
            const fetchedPosts: Post[] = [];

            try {
                for (let i = 0; i < POST_TARGET_COUNT; i++) {
                    const res = await api.get(`posts/random`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const raw = res.data;
                    if (!raw || !raw._id) continue;

                    const post: Post = {
                        ...raw,
                        tags: fixArrayField(raw.tags),
                        moods: fixArrayField(raw.moods),
                        instruments: fixArrayField(raw.instruments),
                    };

                    fetchedPosts.push(post);
                }

                setPosts(fetchedPosts);
                const sorted = [...fetchedPosts].sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves));
                setPopularPosts(sorted);
            } catch (error) {
                console.error("Error in fetch loop:", error);
            }
        };

        fetchMultiplePosts();

        api.get(`/users/me`, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        .catch(() => {
            setShowPopup(true);
            localStorage.removeItem("token");
            navigate("/login");
        });
    }, [navigate]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCardClick = (postId: string, layoutId: string) => {
        setSelectedPostId(postId);
        setSelectedLayoutId(layoutId);
    };

    const handleCloseCardDetails = () => {
        setSelectedPostId(null);
        setSelectedLayoutId(null);
    };

    const selectedPost = posts.find(post => post._id === selectedPostId);

    return (
<div className="app">
  {showPopup && <CustomPopup message={message} onClose={() => window.location.href = "/"} />}
  <Header />
  <div className={styles.leftSlide}><LeftSlide /></div>
  <div className={styles.content}>
    <div className={styles.cardsContainer}>
      {posts.map((post, index) => (
        <motion.div
          className={`${styles.card} ${selectedLayoutId === `post-${index}` ? styles.hidden : ''}`}
          key={`${post._id}-${index}`}
          layoutId={`post-${index}`}
          onClick={() => handleCardClick(post._id, `post-${index}`)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundImage: `url(https://ui-avatars.com/api/?name=${UserSingleton.getInstance().getUsername()}&background=8731e4&color=fff&size=128)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={styles.cardOverlay}>
            <h4>{post.title}</h4>
            <p>{post.genre} — {post.bpm} bpm</p>
            <span className={styles.likes}>{post.likes}  <i className="fa-so lid fa-heart"></i></span>
            <div className={styles.cardUser}>
              <img
                src={`https://ui-avatars.com/api/?name=${UserSingleton.getInstance().getUsername()}&background=8731e4&color=fff&size=128`}
                alt="User avatar"
              />
              <span>{UserSingleton.getInstance().getUsername()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>

  <AnimatePresence>
    {selectedPost && selectedLayoutId && (
      <CardDetails
        post={selectedPost}
        image={`${STATIC_BASE}/beatnow/${UserSingleton.getInstance().getId()}/posts/${selectedPost._id}/caratula.${selectedPost.cover_format}`}
        audio={`${STATIC_BASE}/beatnow/${UserSingleton.getInstance().getId()}/posts/${selectedPost._id}/audio.${selectedPost.audio_format}`}
        layoutId={selectedLayoutId}
        onClose={handleCloseCardDetails}
      />
    )}
  </AnimatePresence>
</div>

    );
}

export default Explore;