pauseButton.addEventListener("click", () => {
  if (!gameOver) {
    running = !running;
    if (!running) {
      pauseButton.innerHTML = "Resume";
    } else {
      pauseButton.innerHTML = "Pause";
    }
  }
});

resetButton.addEventListener("click", () => {
  resetGame();
});

document.onkeydown = function(e) {
  if (gameOver) {
    resetGame();
  }
  e.preventDefault();
  if (!running) {
    return;
  }
  switch (e.keyCode) {
    case 40: //down
      drop();
      score++;
      break;
    case 37: //left
      move(-1);
      break;
    case 39: //right
      move(1);
      break;
    case 32: //space
      hardDrop();
      break;
    case 38: //up
      currentPieceRotate(1);
      break;
    case 87: //w
      currentPieceRotate(-1);
      break;
    default:
      break;
  }
};
