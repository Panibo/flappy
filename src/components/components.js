import pipe from "../assets/pipe.png";
import background from "../assets/bg.svg";

const pipeImage = new Image();
pipeImage.src = pipe;

const bgImage = new Image();
bgImage.src = background;

pipeImage.onload = () => {
  console.log("Image loaded");
};

bgImage.onload = () => {
  console.log("Image loaded");
};

const drawPlayer = (ctx, x, y, playerSize) => {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.rect(x, y, playerSize, playerSize);
  ctx.fill();
};

const drawObstacle = (ctx, x, gapPosition, gapSize, obstacleWidth) => {
  // Top pipe
  const pipeDimensions = { x: 300, y: 2000 };
  const aspectRatio = pipeDimensions.x / pipeDimensions.y;

  const drawnPipeHeight = obstacleWidth / aspectRatio;

  ctx.drawImage(
    pipeImage,
    x,
    -drawnPipeHeight + gapPosition - gapSize / 2,
    obstacleWidth,
    obstacleWidth / aspectRatio
  );

  // Bottom pipe
  ctx.save();
  ctx.scale(1, -1);
  ctx.drawImage(
    pipeImage,
    x,
    -(gapPosition + gapSize / 2 + obstacleWidth / aspectRatio),
    obstacleWidth,
    obstacleWidth / aspectRatio
  );
  ctx.restore();
};

const drawBackground = (ctx, canvas, x, bgWidth) => {
  const bg = new Image();
  bg.src = bg; // Ensure you're using your background image here

  // Wait for the background image to load before drawing it
  bg.onload = () => {
    const aspectRatio = bg.width / bg.height;
    bgWidth.current = canvas.height * aspectRatio; // Set the background width

    // Draw the background as a repeating tile
    ctx.drawImage(bg, x, 0, bgWidth.current, canvas.height);
    ctx.drawImage(bg, x + bgWidth.current, 0, bgWidth.current, canvas.height);
  };
};
export default { drawPlayer, drawObstacle, drawBackground };
