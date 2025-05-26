import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import UserSingleton from "../../Model/UserSingleton";
import api from '../../api/client';
import CardDetails from "../../components/CardDetails/CardDetails";
import CustomPopup from "../../components/Popup/CustomPopup";
import LoadingPopup from "../../components/Loading/Loading"; // Importar el componente LoadingPopup
import styles from './Explore.module.css';

interface Post {
    _id: string;
    title: string;
    description?: string;
    creator_username?: string;
    isLiked?: boolean;
    isSaved?: boolean;
    cover?: string;
    audio?: string;
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
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState<boolean>(true);  // Estado de carga

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
            try {
                setLoading(true);  // Inicia el estado de carga

                const requests = [];
                for (let i = 0; i < POST_TARGET_COUNT; i++) {
                    const request = api.get('posts/random', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    requests.push(request);
                }

                // Ejecuta todas las solicitudes en paralelo
                const responses = await Promise.all(requests);
                const fetchedPosts: Post[] = responses.map((res) => {
                    const raw = res.data;
                    if (!raw || !raw._id) return null;

                    return {
                        title: raw.title,
                        description: raw.description,
                        tags: fixArrayField(raw.tags),
                        genre: raw.genre,
                        moods: fixArrayField(raw.moods),
                        instruments: fixArrayField(raw.instruments),
                        bpm: raw.bpm || 0,
                        user_id: raw.user_id,
                        publication_date: raw.publication_date,
                        audio_format: raw.audio_format,
                        cover_format: raw.cover_format,
                        likes: raw.likes || 0,
                        saves: raw.saves || 0,
                        _id: raw._id,
                        creator_username: raw.creator_username,
                        isLiked: raw.isLiked || false,
                        isSaved: raw.isSaved || false,
                    };
                }).filter(post => post !== null);

                // Eliminar duplicados por _id
                const uniquePosts = fetchedPosts.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t._id === value._id
                    ))
                );

                setPosts(uniquePosts);  // Asigna los posts únicos
                setLoading(false);  // Cambia el estado a false cuando las publicaciones están cargadas
            } catch (error) {
                console.error("Error in fetch loop:", error);
                setMessage("Error fetching posts. Please try again later.");
                setShowPopup(true);
                setLoading(false);  // Cambia el estado a false si ocurre un error
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

    const handleCardClick = (postId: string) => {
        setSelectedPostId(postId);
        navigate(`/video/${postId}`);
    };

    const handleCloseCardDetails = () => {
        setSelectedPostId(null);
    };

    const selectedPost = posts.find(post => post._id === selectedPostId);

    return (
        <div className="app">
            {showPopup && <CustomPopup message={message} onClose={() => window.location.href = "/"} />}
            
            {/* Muestra el LoadingPopup si loading es verdadero */}
            {loading && <LoadingPopup message="Loading posts..." />}
            
            <Header />
            <div className={styles.leftSlide}><LeftSlide /></div>
            <div className={styles.content}>
                <div className={styles.cardsContainer}>
                    {posts.map((post, index) => (
                        <motion.div
                            className={`${styles.card}`}
                            key={`${post._id}-${index}`}  // Combina el _id con el índice para hacer la clave única
                            layoutId={`post-${post._id}`}
                            onClick={() => handleCardClick(post._id)}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                backgroundImage: `url(http://127.0.0.1/beatnow/${post.user_id}/posts/${post._id}/caratula.${post.cover_format})`,
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
                                        src={`http://127.0.0.1/beatnow/${post.user_id}/photo_profile/photo_profile.jpg`}
                                        alt="User avatar"
                                    />
                                    <span>{post.creator_username}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Explore;
