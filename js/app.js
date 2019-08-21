let running = true;

let dropCounter = 0;
let dropInterval = 250;
let lastTime = 0;
let keepHardDropping = true;
let gameOver = false;

function resetGame() {
  grid.forEach(row => row.fill(0));
  shapeBag = replenishShapeBag().concat(replenishShapeBag());
  resetPiece();
  score = 0;
  dropInterval = 250;
  pauseButton.style.opacity = 1;
  gameOver = false;
  canvas.style.opacity = 0.7;
  running = true;
  resetButton.innerHTML = "Reset";
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(grid, { x: 0, y: 0 }, context);
  drawGrid(currentPiece.matrix, currentPiece.pos, context);
}

function collide(grid, currentPiece) {
  const [matrix, pos] = [currentPiece.matrix, currentPiece.pos];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (
        matrix[y][x] &&
        (grid[y + pos.y] && grid[y + pos.y][x + pos.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function merge(grid, currentPiece) {
  currentPiece.matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val) {
        grid[y + currentPiece.pos.y][x + currentPiece.pos.x] = val;
      }
    });
  });
}

function drawGrid(matrix, offset, context) {
  matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val) {
        context.fillStyle = colorMap[val];
        context.fillRect(x + offset.x, y + offset.y, 0.97, 0.97);
      }
    });
  });
}

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

function clearLines() {
  counter = 0;
  for (let y = 0; y < grid.length; y++) {
    if (!grid[y].includes(0)) {
      counter++;
      const row = grid.splice(y, 1)[0].fill(0);
      grid.unshift(row);
      if (dropInterval > 75) {
        dropInterval -= 10;
      }
    }
  }

  switch (counter) {
    case 1:
      score += 100;
      break;
    case 2:
      score += 250;
      break;
    case 3:
      score += 400;
      break;
    case 4:
      score += 500;
      break;
    default:
      break;
  }
}

function drop() {
  keepHardDropping = true;
  currentPiece.pos.y++;
  if (collide(grid, currentPiece)) {
    currentPiece.pos.y--;
    keepHardDropping = false;
    if (dropInterval > 100) {
      dropInterval -= 1;
    }
    merge(grid, currentPiece);
    clearLines();
    resetPiece();
  }
  dropCounter = 0;
}
function resetPiece() {
  currentPiece.type = randomType();
  currentPiece.matrix = pieceMatrixHash[currentPiece.type];
  currentPiece.pos.y = 0;
  currentPiece.pos.x = midpoint - ((currentPiece.matrix[0].length / 2) | 0);
  if (collide(grid, currentPiece)) {
    currentPiece.pos.y -= 1;
    endGame();
  }
  setNext(shapeBag[0]);
}

function endGame() {
  canvas.style.opacity = 0.5;
  pauseButton.style.opacity = 0.25;
  gameOver = true;
  running = false;
  resetButton.innerHTML = "New Game";
}

function move(dir) {
  currentPiece.pos.x += dir;
  if (collide(grid, currentPiece)) {
    currentPiece.pos.x -= dir;
  }
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function currentPieceRotate(dir) {
  const pos = currentPiece.pos.x;
  let offset = 1;
  rotate(currentPiece.matrix, dir);
  while (collide(grid, currentPiece)) {
    if (currentPiece.type === "I") {
      currentPiece.matrix.forEach(row => row.reverse());
      if (currentPiece.pos.x <= 0) {
        currentPiece.pos.x = -1;
      } else {
        currentPiece.pos.x = 7;
      }
    }
    currentPiece.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > currentPiece.matrix[0].length) {
      rotate(currentPiece.matrix, -dir);
      currentPiece.pos.x = pos;
      return;
    }
  }
}

function hardDrop() {
  while (keepHardDropping) {
    drop();
    score += 10;
  }
}

function startGame() {
  resetGame();
  update();
}

startGame();
