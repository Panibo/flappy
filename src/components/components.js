import pipe from "../assets/pipe.png";

const pipeImage = new Image();
pipeImage.src = pipe;

pipeImage.onload = () => {
  // Now you can use drawPlayer and drawObstacle
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

export default { drawPlayer, drawObstacle };
