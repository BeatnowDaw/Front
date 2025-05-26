// src/components/VideoPage/VideoPageContainer.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPage from "./VideoPage";

export interface PostData {
  _id: string;
  user_id: string;
  audio_format: string;
  cover_format: string;
  title: string;
  creator_username: string;
  tags: string[];
  likes: number;
  saves: number;
  description?: string;
}

export default function VideoPageContainer() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PostData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, [id]);

  if (!data) return <div>Loading…</div>;

  const STATIC = import.meta.env.VITE_API_BASE_URL.replace(
    /\/v1\/api\/?$/,
    ""
  );
  const { user_id, _id, audio_format, cover_format, title, creator_username, tags, likes, saves, description } = data;

  return (
    <VideoPage
        videoUrl={`${STATIC}/beatnow/${user_id}/posts/${_id}/audio.${audio_format}`}
        coverImageUrl={`${STATIC}/beatnow/${user_id}/posts/${_id}/caratula.${cover_format}`}
        title={title}
        author={creator_username}
        authorId={user_id}               
                
        tags={tags}
        likes={likes}
        saves={saves}
        description={description}
        />
  );
}
