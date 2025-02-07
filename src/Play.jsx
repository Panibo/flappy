import { useEffect, useState, useRef } from "react";
import "./Play.css"; // Import the arcade-style CSS

const Play = ({
  timeScale,
  setPlay,
  play,
  lastScore,
  playerCoords,
  obstacles,
  setScore,
  defaultPlayerCoords,
  isLost,
}) => {
  const [highScore, setHighScore] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }

    if (lastScore > highScore) {
      setHighScore(lastScore);
      localStorage.setItem("highScore", lastScore);
    }
  }, [lastScore]);

  useEffect(() => {
    audioRef.current = new Audio("/flappy/music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;
  }, []);

  const handlePlay = () => {
    playerCoords.current = { ...defaultPlayerCoords.current };
    obstacles.current = [];

    setPlay(false);
    timeScale.current = 1;
    setScore(0);
    isLost.current = false;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.pause();
    }
  }, [play]);

  if (!play) return null; // Ensure component does not render when `play` is false

  return (
    <div className="arcade-container">
      <h1 className="arcade-title">Flappy Juho</h1>
      <div className="score-display">
        <p>
          🏆 High Score: <span>{highScore}</span>
        </p>
        <p>
          🔥 Last Score: <span>{lastScore}</span>
        </p>
      </div>
      <button className="play-button" onClick={handlePlay}>
        ▶ Play
      </button>
    </div>
  );
};

export default Play;
