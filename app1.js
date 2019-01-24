const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreBoard = document.getElementById("scoreBoard");
const next = document.getElementById("next")
let running = true;
const grid = createMatrix(12, 20);
let midpoint = (grid[0].length / 2) | 0;
let isI;

let pauseButton = document.getElementById("pause-button");
pauseButton.addEventListener("click", () => {
    running = !running;
    if (!running) {
        pauseButton.innerHTML = "Resume";
    } else {
        pauseButton.innerHTML = "Pause";
    }
});

let score = 0;
const colorMap = ["black", "red", "orange", "yellow", "green", "teal", "indigo", "pink", "white"]

let shapeBag = replenishShapeBag();

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
    return shuffle("IIIIIII".split(""));
}

context.scale(20, 20);

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
    debugger
    switch (type) {
        case "T":
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ];
            break;
        case "O":
            return [
                [2, 2],
                [2, 2]
            ];
            break;
        case "I":
            return [
                [3, 0, 0, 0],
                [3, 0, 0, 0],
                [3, 0, 0, 0],
                [3, 0, 0, 0],

            ];
            break;
        case "L":
            return [
                [4, 4, 4],
                [4, 0, 0],
                [0, 0, 0]
            ];
            break;
        case "J":
            return [
                [5, 5, 5],
                [0, 0, 5],
                [0, 0, 0]
            ];
            break;
        case "S":
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ];
            break;
        case "Z":
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ];
            break;    
        default:
            break;
    }
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(grid, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function collide(grid, player) {
    const [matrix, pos] = [player.matrix, player.pos]
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



function merge(grid, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                grid[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = colorMap[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1)
            }
        });
    });
}

function drawGrid(matrix, offset) {
  debugger
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value >= 0) {
        context.fillStyle = colorMap[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
let dropCounter = 0;
let dropInterval = 250;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    updateScore();
    if (dropCounter > dropInterval && running) {
        playerDrop();
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
                dropInterval -=5;
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

let keepHardDropping;

function playerDrop() {
    keepHardDropping = true;
    player.pos.y++;
    if (collide(grid, player)) {
        player.pos.y--;
        keepHardDropping = false;
        merge(grid, player);
        clearLines();
        resetPiece();
    }
    dropCounter = 0;
}
function resetPiece() {
    player.type = randomType();
    player.matrix = createPiece(player.type);
    player.pos.y = 0;
    player.pos.x = midpoint - (player.matrix[0].length / 2 | 0);
    if (collide(grid, player)) {
        alert("Game Over");
        resetGame();
    }
}
function resetGame() {
    grid.forEach(row => row.fill(0));
    resetPiece();
    score = 0;
    dropInterval = 1500;
    
}

let resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  resetGame()
});

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(grid, player)) {
       player.pos.x -= dir;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir)
    while (collide(grid, player)) {
        if (isI) {
            player.matrix.forEach(row => row.reverse());
            if (player.pos.x <= 0) {
                player.pos.x = -1;
            } else {
                player.pos.x -= 4;
            }
        }
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir)
            player.pos.x = pos;
            return;
        }
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


document.onkeydown = function(e) {
  e.preventDefault();
  if (!running) {
    return;
  }
  switch (e.keyCode) {
    case 40: //down
      playerDrop();
      score++;
      break;
    case 37: //left
      playerMove(-1);
      break;
    case 39: //right
      playerMove(1);
      break;
    case 32: //space
      hardDrop();
      break;
    case 81: //q
      playerRotate(1);
      break;
    case 87: //w
      playerRotate(-1);
      break;
    default:
      break;
  }
};

function updateScore() {
    scoreBoard.innerHTML = `Score: ${score}`;
}

function hardDrop() {
    while (keepHardDropping) {
        playerDrop();
        score++;
    }

}


const player = {
  pos: { x: midpoint, y: -2 },
  matrix: createPiece(randomType())
};

resetPiece();
update();

