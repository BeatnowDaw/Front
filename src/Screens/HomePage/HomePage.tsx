import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import UserSingleton from "../../Model/UserSingleton";
import api from '../../api/client';
import CardDetails from "../../components/CardDetails/CardDetails";
import CustomPopup from "../../components/Popup/CustomPopup";
import beat1 from "../../../public/beat1.png";
import "./HomePage.css";

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

function Home() {
    const navigate = useNavigate();
    const [tokenExists, setTokenExists] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkSessionAndLoadPosts();
    }, []);

    const checkSessionAndLoadPosts = async () => {
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

            await fetchRandomPosts(10); // Cargar 10 posts aleatorios
        } catch {
            setTokenExists(false);
            setShowPopup(true);
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const fetchRandomPosts = async (count: number) => {
        const token = localStorage.getItem("token");
        const fetchedPosts: Post[] = [];
        const fetchedIds = new Set<string>();

        while (fetchedPosts.length < count) {
            try {
                const response = await api.get(`/random`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const post: Post = response.data;
                if (!fetchedIds.has(post._id)) {
                    fetchedPosts.push(post);
                    fetchedIds.add(post._id);
                }
            } catch (error) {
                console.error("Error fetching random post:", error);
                break;
            }
        }

        setPosts(fetchedPosts);
        setLoading(false);
    };

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
        <div className="tiktok-feed">
            {showPopup && <CustomPopup message={message} onClose={() => window.location.href = "/"} />}
            <Header />
            <LeftSlide />
            <div className="feed-content">
                {loading ? (
                    <p className="loading-message">Cargando publicaciones...</p>
                ) : (
                    <div className="video-grid">
                        {posts.map((post, index) => (
                            <motion.div
                                className={`video-card ${selectedLayoutId === `post-${index}` ? 'hidden' : ''}`}
                                key={post._id}
                                layoutId={`post-${index}`}
                                onClick={() => handleCardClick(post._id, `post-${index}`)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img className="video-thumbnail" src={beat1} alt="Thumbnail" />
                                <div className="video-meta">
                                    <h4>{post.title}</h4>
                                    <p>{new Date(post.publication_date).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default Home;
