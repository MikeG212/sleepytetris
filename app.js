const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreBoard = document.getElementById("scoreBoard");
const next = document.getElementById("next")
let running = true;
const grid = createMatrix(12, 20);
let midpoint = (grid[0].length / 2) | 0;
let isI;
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
let shapeBag = replenishShapeBag().concat(replenishShapeBag());
let dropCounter = 0;
let dropInterval = 250;
let lastTime = 0;
let keepHardDropping = true;
let gameOver = false;

context.scale(20, 20);

const currentPiece = {
    pos: { x: midpoint, y: -2 },
    matrix: createPiece(randomType())
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
    resetGame()
});

function resetGame() {
    grid.forEach(row => row.fill(0));
    resetPiece();
    score = 0;
    dropInterval = 250;
    gameOver = false;
    canvas.style.opacity = 1;
    running = true;
    resetButton.innerHTML = "Reset";

}

document.onkeydown = function (e) {
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

function setNext() {
    next.innerHTML = `Next: ${shapeBag.slice(0, 4)}`;
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
        shapeBag = shapeBag.concat(replenishShapeBag()).concat(replenishShapeBag());
    }
    setNext();
    return type;
}

function createPiece(type) {
    type === "I" ? isI = true : isI = false;
    switch (type) {
        case "T":
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ];
            // break;
        case "O":
            return [
                [2, 2],
                [2, 2]
            ];
            // break;
        case "I":
            return [
                [0, 0, 0, 0],
                [3, 3, 3, 3],
                [0, 0, 0, 0],
                [0, 0, 0, 0],

            ];
            // break;
        case "L":
            return [
                [4, 4, 4],
                [4, 0, 0],
                [0, 0, 0]
            ];
            // break;
        case "J":
            return [
                [5, 5, 5],
                [0, 0, 5],
                [0, 0, 0]
            ];
            // break;
        case "S":
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ];
            // break;
        case "Z":
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ];
            // break;    
        default:
            break;
    }
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(grid, {x: 0, y: 0});
    drawMatrix(currentPiece.matrix, currentPiece.pos);
}

function collide(grid, currentPiece) {
    const [matrix, pos] = [currentPiece.matrix, currentPiece.pos]
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] &&
                (grid[y + pos.y] &&
                grid[y + pos.y][x + pos.x]) !==0) {
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

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val) {
                context.fillStyle = colorMap[val];
                context.fillRect(x + offset.x, y + offset.y, 1, 1)
            }
        });
    });
}

function drawGrid(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val >= 0) {
        context.fillStyle = colorMap[val];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
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
                dropInterval -= 50;
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
    currentPiece.matrix = createPiece(currentPiece.type);
    currentPiece.pos.y = 0;
    currentPiece.pos.x = midpoint - (currentPiece.matrix[0].length / 2 | 0);
    if (collide(grid, currentPiece)) {
        currentPiece.pos.y -= 1;
        endGame();
    }
}

function endGame() {
    canvas.style.opacity = .5;
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
        for (let x = 0; x < y; x++ ) {
            [
                matrix[x][y],
                matrix [y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse())
    } else {
        matrix.reverse();
    }
}

function currentPieceRotate(dir) {
  const pos = currentPiece.pos.x;
  let offset = 1;
  rotate(currentPiece.matrix, dir);
  while (collide(grid, currentPiece)) {

    if (isI) {
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

