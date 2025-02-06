import pipe from "/pipe.png";
import background from "/bg.svg";
import juho from "/flappyjuho.png";

const pipeImage = new Image();
pipeImage.src = pipe;

const bg = new Image();
bg.src = background;

const juhoImage = new Image();
juhoImage.src = juho;

const drawPlayer = (ctx, x, y, playerSize) => {
  ctx.drawImage(juhoImage, x, y, playerSize, playerSize);
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
  // Draw the background as a repeating tile
  ctx.drawImage(bg, x, 0, bgWidth, canvas.height);
};
export default { drawPlayer, drawObstacle, drawBackground };
