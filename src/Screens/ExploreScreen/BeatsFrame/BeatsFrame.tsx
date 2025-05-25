import React, { useEffect, useState } from "react";
import UserSingleton from "../../../Model/UserSingleton";
import api from "../../../api/client";

interface Beat {
  _id: string;
  title: string;
  genre: string;
  publication_date: string;

}

const ListBeat: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);

  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const username = UserSingleton.getInstance().getUsername();
        const token = localStorage.getItem("token");

        const response = await api.get<Beat[]>(`/posts/user/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBeats(response.data);
      } catch (error) {
        console.error("Failed to fetch beats:", error);
      }
    };

    fetchBeats();
  }, []); 

  return (
    <div>
      <h1>Beats List</h1>
      {beats.length === 0 ? (
        <p>No tienes beats publicados aún.</p>
      ) : (
        <ul>
          {beats.map(beat => (
            <li key={beat._id}>
              <strong>{beat.title}</strong> — {beat.genre} —{" "}
              {new Date(beat.publication_date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListBeat;