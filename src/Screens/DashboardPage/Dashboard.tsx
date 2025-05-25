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
    tags: string[]; // Add this line
    genre: string;
    moods: string[];
    instruments: string[];
    bpm: number;
    user_id: string;
    audio_format: string;
    cover_format: string;
}

const API_BASE    = import.meta.env.VITE_API_BASE_URL!; 
const STATIC_BASE = API_BASE.replace(/\/v1\/api\/?$/, ''); 

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay,
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};


function Dashboard() {
    const navigate = useNavigate();
    const [tokenExists, setTokenExists] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [popularPosts, setPopularPosts] = useState<Post[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkUsername();
        const username = UserSingleton.getInstance().getUsername();
        const token = localStorage.getItem("token");

        api.get(`/users/posts/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                const data = response.data;
                setPosts(data);
                const sortedPosts = [...data].sort((a, b) => (b.likes + b.saves) - (a.likes + a.saves));
                setPopularPosts(sortedPosts);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        api.get(`/users/me`, {
                    headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${token}`,
                  }
                })
            .then((response) => {
                if (response.status === 200) {

                    console.log("Información del usuario:", response.data);
                }
            })
            .catch((error) => {
                console.error("Error al obtener la información del usuario.");
                setTokenExists(false);
                setShowPopup(true);
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, [navigate]);



    const defaultPost: Post = {
        _id: '',
        title: '',
        publication_date: '',
        likes: 0,
        saves: 0,
        tags: [],
        genre: '',
        moods: [],
        instruments: [],
        bpm: 0,
        user_id: '',
        audio_format: '',
        cover_format: ''
    };


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    function handleClick() {
        navigate("/Upload", { state: { token: localStorage.getItem("token") } });
    }

    const handleCardClick = (postId: string) => {
        // printar a consola todos los detalles del post
        console.log(posts.find(post => post._id === postId));
        // setSelectedPostId(postId);
        // setSelectedLayoutId(layoutId);
        navigate(`/video/${postId}`);
    };

    const handleCloseCardDetails = () => {
        setSelectedPostId(null);
        setSelectedLayoutId(null);
    };

    const selectedPost = posts.find(post => post._id === selectedPostId);

    function checkUsername() {
        if (UserSingleton.getInstance().getUsername() === "" || UserSingleton.getInstance().getUsername() === null) {
            setMessage("Session has expired, redirecting to landing page.");
            setShowPopup(true);
        }
    }

    return (
        <div className="app">
            {showPopup && <CustomPopup message={message} onClose={() => window.location.href = "/"} />}
            <Header />
            <div className="leftSlide">
                <LeftSlide />
            </div>
            <div className="content">
                <div className="dash-header">
                    <h1 className="home">{UserSingleton.getInstance().getUsername()}'s dashboard</h1>
                    <button className="uploadButton" onClick={handleClick} title="Upload a beat">
                        <i className="fa-solid fa-plus" />
                    </button>
                    <h1 className="rt-clock">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</h1>
                </div>

               {posts.length === 0 ? (
  <motion.h2
    className="empty-dashboard-msg"
    variants={fadeUp}
    initial="hidden"
    animate="visible"
  >
    Your dashboard looks empty...<br />
    Try uploading some beats, share your creativity!
  </motion.h2>
) : (

                    <>
                    <div className="section-container">
                       <motion.h3 variants={fadeUp}>Recent Uploads</motion.h3>
                        <div className="cards-container">
                            {posts.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime()).map((post, index) => (
                            <motion.div
                                className={`card ${selectedLayoutId === `post-${index}` ? 'hidden' : ''}`}
                                key={post._id}
                                layoutId={`post-${index}`}
                                onClick={() => handleCardClick(post._id)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <button
                                    className="card-play-btn"
                                    onClick={e => {
                                    e.stopPropagation();
                                    navigate(`/video/${post._id}`);
                                    }}
                                >
                                    ▶
                                </button>
                                <img className="post-picture" src={`${STATIC_BASE}/beatnow/${UserSingleton.getInstance().getId()}/posts/${post._id}/caratula.${post.cover_format}`} alt="Post" />
                                <h4><b>{post.title}</b></h4>
                                <p>{new Date(post.publication_date).toLocaleDateString()}</p>
                            </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="section-container">
                        <h3>Popular Uploads</h3>
                        <div className="cards-container">
                            {popularPosts.map((post, index) => (
                            <motion.div
                                className={`card ${selectedLayoutId === `popular-${index}` ? 'hidden' : ''}`}
                                key={post._id}
                                layoutId={`popular-${index}`}
                                onClick={() => handleCardClick(post._id)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <button
                                    className="card-play-btn"
                                    onClick={e => {
                                    e.stopPropagation();
                                    navigate(`/video/${post._id}`);
                                    }}
                                >
                                    ▶
                                </button>
                                <img className="post-picture" src={`${STATIC_BASE}/beatnow/${UserSingleton.getInstance().getId()}/posts/${post._id}/caratula.${post.cover_format}`} alt="Post" />
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
                {selectedPost && selectedLayoutId && (
                    <CardDetails
                        post={selectedPost}
                        image={`${STATIC_BASE}/beatnow/${UserSingleton.getInstance().getId()}/posts/${selectedPost._id}/caratula.${selectedPost.cover_format}`}
                        audio={`${STATIC_BASE}/beatnow/${UserSingleton.getInstance().getId()}/posts/${selectedPost._id}/audio.${selectedPost.audio_format}`}
                        layoutId={selectedLayoutId}
                        onClose={handleCloseCardDetails} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Dashboard;