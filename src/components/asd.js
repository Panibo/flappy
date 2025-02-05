import pipe from "../assets/pipe.png";

const pipeImage = new Image();
pipeImage.src = pipe;

pipeImage.onload = () => {
  // Now you can use drawPlayer and drawObstacle
  console.log("Image loaded");
};

const drawPlayer = (ctx, x, y) => {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.rect(x, y, 40, 40);
  ctx.fill();
};

const drawObstacle = (ctx, x, gapPosition, gapSize, pipeWidth, pipeHeight) => {
  // Ensure the pipes are not stretched or squashed. We maintain the image's natural height.
  // The height of the top and bottom pipes is determined by the `pipeHeight`.

  // Top pipe
  ctx.drawImage(pipeImage, x, 0, pipeWidth, pipeHeight);

  // Bottom pipe (we need to draw the bottom pipe starting at the position below the gap)
  ctx.save();
  ctx.scale(1, -1);
  ctx.drawImage(pipeImage, x, gapPosition + gapSize / 2, pipeWidth, pipeHeight);
  ctx.restore();
};

export default { drawPlayer, drawObstacle };
