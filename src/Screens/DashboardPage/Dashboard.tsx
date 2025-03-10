import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../Layout/Header/Header";
import LeftSlide from "../../Layout/LeftSlide/LeftSlide";
import "./Dashboard.css";
import CardDetails from "../../components/CardDetails/CardDetails";
import { useNavigate } from "react-router-dom";

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

function Dashboard() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);

    // Datos de prueba para mostrar publicaciones sin API
    const posts: Post[] = [
        {
            _id: "1",
            title: "Chill Vibes",
            publication_date: "2025-03-10",
            likes: 120,
            saves: 45,
            tags: ["chill", "lofi"],
            genre: "Lo-Fi",
            moods: ["Relax"],
            instruments: ["Piano"],
            bpm: 85,
            user_id: "user123",
            audio_format: "mp3",
            cover_format: "jpg"
        }
    ];

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setCurrentTime(new Date());
    //     }, 1000);
    //     return () => clearInterval(timer);
    // }, []);

    function handleClick() {
        navigate("/Upload");
    }

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
            <Header />
            <div className="leftSlide">
                <LeftSlide />
            </div>
            <div className="content">
                <div className="dash-header">
                    <h1 className="home">User's Dashboard</h1>
                    <button className="uploadButton" onClick={handleClick} title="Upload a beat">
                        <i className="fa-solid fa-plus" />
                    </button>
                    <h1 className="rt-clock">{currentTime.toLocaleTimeString("en-US", { hour12: false })}</h1>
                </div>

                <div className="section-container">
                    <h3>Recent Uploads</h3>
                    <div className="cards-container">
                        {posts.map((post, index) => (
                            <motion.div
                                className={`card ${selectedLayoutId === `post-${index}` ? 'hidden' : ''}`}
                                key={post._id}
                                layoutId={`post-${index}`}
                                onClick={() => handleCardClick(post._id, `post-${index}`)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img className="post-picture" src={`https://via.placeholder.com/150`} alt="Post" />
                                <h4><b>{post.title}</b></h4>
                                <p>{new Date(post.publication_date).toLocaleDateString()}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {selectedPost && selectedLayoutId && (
                    <CardDetails
                        post={selectedPost}
                        image={`https://via.placeholder.com/150`}
                        audio={`#`}
                        layoutId={selectedLayoutId}
                        onClose={handleCloseCardDetails}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Dashboard;
