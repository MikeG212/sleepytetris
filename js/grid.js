const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const grid = createMatrix(12, 20);
context.scale(20, 20);

function createMatrix(width, height) {
  const matrix = [];
  while (matrix.length < height) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(grid, { x: 0, y: 0 }, context);
  drawGrid(currentPiece.matrix, currentPiece.pos, context);
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

function setNext(type) {
  const nextGrid = createMatrix(6, 6);

  const nextPiece = {
    pos: { x: 3, y: 2 },
    matrix: pieceMatrixHash[type],
    type: type
  };
  nextContext.fillStyle = "#000";
  nextContext.fillRect(0, 0, 100, 100);
  merge(nextGrid, nextPiece);
  drawGrid(nextGrid, { x: -1, y: -1 }, nextContext);
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

function merge(grid, currentPiece) {
  currentPiece.matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val) {
        grid[y + currentPiece.pos.y][x + currentPiece.pos.x] = val;
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
