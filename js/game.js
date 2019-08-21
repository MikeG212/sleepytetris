let running;
let dropCounter;
let dropInterval;
let lastTime = 0;
let gameOver = false;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  updateScore();
  if (dropCounter > dropInterval && running) {
    drop();
  }
  draw();
  requestAnimationFrame(update);
}

function resetGame() {
  grid.forEach(row => row.fill(0));
  shapeBag = replenishShapeBag().concat(replenishShapeBag());
  resetPiece();
  score = 0;
  dropInterval = 250;
  pauseButton.style.opacity = 0.7;
  gameOver = false;
  canvas.style.opacity = 0.7;
  running = true;
  dropCounter = 0;
  resetButton.innerHTML = "Reset";
  update();
}

function endGame() {
  canvas.style.opacity = 0.5;
  pauseButton.style.opacity = 0.25;
  gameOver = true;
  running = false;
  resetButton.innerHTML = "New Game";
}

resetGame();
