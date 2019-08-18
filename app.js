const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const scoreBoard = document.getElementById("scoreBoard");
const next = document.getElementById("next");
const nextContext = next.getContext("2d");

nextContext.scale(15, 15);

let running = true;
const grid = createMatrix(12, 20);
let midpoint = (grid[0].length / 2) | 0;
let score = 0;
const colorMap = [
  "black",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "indigo",
  "pink",
  "white"
];
const pieceMatrixHash = {
  T: [[1, 1, 1], [0, 1, 0], [0, 0, 0]],
  O: [[2, 2], [2, 2]],
  I: [[0, 0, 0, 0], [3, 3, 3, 3], [0, 0, 0, 0], [0, 0, 0, 0]],
  L: [[4, 4, 4], [4, 0, 0], [0, 0, 0]],
  J: [[5, 5, 5], [0, 0, 5], [0, 0, 0]],
  S: [[0, 6, 6], [6, 6, 0], [0, 0, 0]],
  Z: [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
};
let shapeBag;
let dropCounter = 0;
let dropInterval = 250;
let lastTime = 0;
let keepHardDropping = true;
let gameOver = false;
let type;

context.scale(20, 20);

const currentPiece = {
  pos: { x: midpoint, y: -2 },
  matrix: pieceMatrixHash[type],
  type: type
};

let pauseButton = document.getElementById("pause-button");
pauseButton.addEventListener("click", () => {
  running = !running;
  if (!running) {
    pauseButton.innerHTML = "Resume";
  } else {
    pauseButton.innerHTML = "Pause";
  }
});

let resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  resetGame();
});

function resetGame() {
  grid.forEach(row => row.fill(0));
  shapeBag = replenishShapeBag().concat(replenishShapeBag());
  resetPiece();
  score = 0;
  dropInterval = 250;
  gameOver = false;
  canvas.style.opacity = 1;
  running = true;
  resetButton.innerHTML = "Reset";
}

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

function shuffle(array) {
  let m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function replenishShapeBag() {
  return shuffle("ITOLSZJ".split(""));
}

function randomType() {
  const type = shapeBag.shift();
  if (shapeBag.length < 7) {
    shapeBag = shapeBag.concat(replenishShapeBag());
  }
  return type;
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

function createMatrix(width, height) {
  const matrix = [];
  while (matrix.length < height) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
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
      if (dropInterval > 100) {
        dropInterval -= 25;
      } else if (dropInterval > 50) {
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

function updateScore() {
  scoreBoard.innerHTML = `Score: ${score}`;
}

function hardDrop() {
  while (keepHardDropping) {
    drop();
    score++;
  }
}

resetGame();
update();
