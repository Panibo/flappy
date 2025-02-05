import { useRef, useEffect, useState } from "react";
import components from "./components/components";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const playerCoords = useRef({ x: 100, y: 250 });
  const velocity = useRef(0);
  const gravity = 0.5;
  const jumpImpulse = -10;
  const obstacles = useRef([]); // Array to store obstacles
  const obstacleSpeed = 3; // Speed at which obstacles move
  let timeScale = 1;
  const [score, setScore] = useState(0); // State to track the score

  const handleLoseGame = () => {
    console.log("You lose!");
    timeScale = 0;
  };

  const incrementScore = () => {
    setScore((prevScore) => prevScore + 1);
  };

  useEffect(() => {
    console.log("Score updated:", score);
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;
    let obstacleSpawnTimer = 0;

    const handleJump = () => {
      velocity.current = jumpImpulse;
    };
    window.addEventListener("click", handleJump);

    const update = () => {
      const gapSize = 350;
      const buffer = 100;
      const obstacleWidth = 150;
      const playerSize = 100;

      // Apply gravity and update player position
      playerCoords.current.y += velocity.current * timeScale;
      velocity.current += gravity * timeScale;

      // Prevent player from falling below ground
      if (playerCoords.current.y >= canvas.height - playerSize) {
        playerCoords.current.y = canvas.height - playerSize;
        velocity.current = 0;
      }

      // Move obstacles left
      obstacles.current = obstacles.current.map((obs) => ({
        ...obs,
        x: obs.x - obstacleSpeed * timeScale,
      }));

      // Remove obstacles that move off-screen
      obstacles.current = obstacles.current.filter(
        (obs) => obs.x + obstacleWidth > 0
      );

      // Check for collision and score increment
      obstacles.current.forEach((obs) => {
        const playerX = playerCoords.current.x;
        const playerY = playerCoords.current.y;

        // Check for collision
        if (
          playerX < obs.x + obstacleWidth &&
          playerX + playerSize > obs.x &&
          (playerY < obs.gapPosition - gapSize / 2 ||
            playerY + playerSize > obs.gapPosition + gapSize / 2)
        ) {
          handleLoseGame();
          return;
        }

        // If player passes the pipe (crosses the obstacle x position)
        if (playerX > obs.x + obstacleWidth && !obs.passed) {
          obs.passed = true; // Mark this pipe as passed
          incrementScore(); // Increment score when passed
        }
      });

      // Spawn new obstacles at intervals
      if (obstacleSpawnTimer <= 0) {
        const minGapPosition = buffer + gapSize / 2;
        const maxGapPosition = canvas.height - buffer - gapSize / 2;

        const gapPosition =
          Math.random() * (maxGapPosition - minGapPosition) + minGapPosition;

        obstacles.current.push({
          x: canvas.width,
          gapPosition: gapPosition,
          passed: false, // Initial state, pipe hasn't been passed yet
        });

        obstacleSpawnTimer = 200;
      } else {
        obstacleSpawnTimer--;
      }

      // Clear canvas and redraw elements
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
  }, []); // We add score to the dependency array so the score will trigger re-render when updated

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
