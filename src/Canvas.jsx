import { useRef, useEffect, useState } from "react";
import components from "./components/components";
import Play from "./Play";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const playerCoords = useRef({ x: 150, y: -10000 });
  const velocity = useRef(0);
  const gravity = 0.5;
  const jumpImpulse = -10;
  const obstacles = useRef([]);
  const obstacleSpeed = 3;
  const timeScale = useRef(0);
  const [score, setScore] = useState(0);
  const [play, setPlay] = useState(true);
  const defaultPlayerCoords = useRef();
  const loseAudioRef = useRef(null);
  const jumpAudioRef = useRef(null);
  const isLost = useRef(false);

  const handleLoseGame = () => {
    if (!isLost.current) {
      console.log("You lost!");
      loseAudioRef.current.play();
      timeScale.current = 0;
      setPlay(true);
      isLost.current = true;
    }
  };

  const incrementScore = () => {
    setScore((prevScore) => prevScore + 1);
  };

  useEffect(() => {
    loseAudioRef.current = new Audio("/fail.wav");
    jumpAudioRef.current = new Audio("/jump.mp3");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;
    const playerSize = 0.1 * canvas.height;
    playerCoords.current = { x: 250, y: 0.5 * canvas.height - playerSize / 2 };
    defaultPlayerCoords.current = { ...playerCoords.current };

    const handleJump = () => {
      velocity.current = jumpImpulse;
      jumpAudioRef.current.play();
    };
    window.addEventListener("click", handleJump);

    const update = () => {
      const gapSize = 0.35 * canvas.height;
      const buffer = 0.05 * canvas.height;
      const obstacleWidth = 0.15 * canvas.height;
      const minDistanceBetweenObstacles = 0.4 * canvas.width;

      playerCoords.current.y += velocity.current * timeScale.current;
      velocity.current += gravity * timeScale.current;

      if (playerCoords.current.y >= canvas.height - playerSize) {
        playerCoords.current.y = canvas.height - playerSize;
        velocity.current = 0;
      }

      obstacles.current = obstacles.current.map((obs) => ({
        ...obs,
        x: obs.x - obstacleSpeed * timeScale.current,
      }));

      obstacles.current = obstacles.current.filter(
        (obs) => obs.x + obstacleWidth > 0
      );

      obstacles.current.forEach((obs) => {
        const playerX = playerCoords.current.x;
        const playerY = playerCoords.current.y;

        if (
          playerX < obs.x + obstacleWidth &&
          playerX + playerSize > obs.x &&
          (playerY < obs.gapPosition - gapSize / 2 ||
            playerY + playerSize > obs.gapPosition + gapSize / 2)
        ) {
          handleLoseGame();

          return;
        }

        if (playerX > obs.x + obstacleWidth && !obs.passed) {
          obs.passed = true;
          incrementScore();
        }
      });

      if (
        obstacles.current.length === 0 ||
        canvas.width - obstacles.current[obstacles.current.length - 1].x >=
          minDistanceBetweenObstacles
      ) {
        const minGapPosition = buffer + gapSize / 2;
        const maxGapPosition = canvas.height - buffer - gapSize / 2;
        const gapPosition =
          Math.random() * (maxGapPosition - minGapPosition) + minGapPosition;

        obstacles.current.push({
          x: canvas.width,
          gapPosition: gapPosition,
          passed: false,
        });
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      components.drawPlayer(
        context,
        playerCoords.current.x,
        playerCoords.current.y,
        playerSize
      );
      obstacles.current.forEach((obs) =>
        components.drawObstacle(
          context,
          obs.x,
          obs.gapPosition,
          gapSize,
          obstacleWidth
        )
      );
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      context.clearRect(0, 0, canvas.width, canvas.height);
      obstacles.current = [];
      window.removeEventListener("click", handleJump);
    };
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="canvas-container">
      <Play
        timeScale={timeScale}
        play={play}
        setPlay={setPlay}
        lastScore={score}
        setScore={setScore}
        playerCoords={playerCoords}
        obstacles={obstacles}
        defaultPlayerCoords={defaultPlayerCoords}
        isLost={isLost}
      />

      <canvas ref={canvasRef} {...props} />
    </div>
  );
};

export default Canvas;
