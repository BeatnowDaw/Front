// src/components/VideoPage/VideoPage.tsx
import { motion } from "framer-motion";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import "./VideoPage.css";

interface VideoPageProps {
  videoUrl: string;
  coverImageUrl: string;
  title: string;
  author: string;
  tags: string[];
  likes: number;
  saves: number;
  description?: string;
}

const VideoPage: React.FC<VideoPageProps> = ({
  videoUrl,
  coverImageUrl,
  title,
  author,
  tags,
  likes,
  saves,
  description,
}) => {
  const navigate = useNavigate();
  const [played, setPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Detecta si la URL es solo audio
  const isAudioOnly = /\.(mp3|wav)$/i.test(videoUrl);

  return (
    <motion.div
      className="vp-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={`vp-video-wrapper${isAudioOnly ? " audio-only" : ""}`}>
        <button className="vp-close-btn" onClick={() => navigate(-1)}>
          ←
        </button>

        {isAudioOnly ? (
          <>
            <img
              className="vp-cover-image"
              src={coverImageUrl}
              alt="Cover"
            />
            {!isPlaying && (
              <button
                className="vp-play-button"
                onClick={() => setIsPlaying(true)}
              >
                ▶
              </button>
            )}
            <ReactPlayer
              url={videoUrl}
              playing={isPlaying}
              controls={false}
              width={0}
              height={0}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onProgress={({ played }) => setPlayed(played)}
            />
          </>
        ) : (
          <>
            <ReactPlayer
              url={videoUrl}
              light={coverImageUrl}
              playing={isPlaying}
              controls={false}
              width="100%"
              height="100%"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onProgress={({ played }) => setPlayed(played)}
            />
            {!isPlaying && (
              <button
                className="vp-play-button"
                onClick={() => setIsPlaying(true)}
              >
                ▶
              </button>
            )}
          </>
        )}
      </div>

      <motion.div
        className="vp-info"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="vp-title">{title}</h1>
        <p className="vp-author">by <b>{author}</b></p>

        <div className="vp-tags">
          {tags.map((t) => (
            <span key={t} className="vp-tag">#{t}</span>
          ))}
        </div>

        <div className="vp-stats">
          <span>❤️ {likes}</span>
          <span>🔖 {saves}</span>
        </div>

        {description && <p className="vp-description">{description}</p>}

        <div className="vp-progress-bar">
          <div
            className="vp-progress"
            style={{ width: `${played * 100}%` }}
          />
        </div>

        <div className="vp-controls">
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button>Share</button>
        </div>

        <div className="vp-comment-box">
          <input type="text" placeholder="Add a comment…" />
          <button>Send</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoPage;
