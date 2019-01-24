const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreBoard = document.getElementById("scoreBoard");
let score = 0;
const pieces = "ITOLSZJ".split("");
let shapeBag = replenishShapeBag();

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
    return shuffle(pieces);
}

context.scale(20, 20);

function createPiece(type) {
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
                [3, 3, 3, 3],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
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
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function collide(arena, player) {
    const [matrix, pos] = [player.matrix, player.pos]
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] &&
                (arena[y + pos.y] &&
                arena[y + pos.y][x + pos.x]) !== 0) {
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

const arena = createMatrix(12,20);
console.log(arena);
console.table(arena);

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = "red";
                context.fillRect(x + offset.x, y + offset.y, 1, 1)
            }
        });
    });
}
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        resetPiece();
    }
    dropCounter = 0;
}
function resetPiece() {
    debugger;
    player.matrix = createPiece(shapeBag.shift());
    if (shapeBag.length < 4) {
        shapeBag += replenishShapeBag();
    }
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - 
                    (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
    }
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir)
    while (collide(arena, player)) {
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
      break;
    case 81: //up
      playerRotate(1);
      break;
    case 87: //up
      playerRotate(-1);
      break;
    default:
      break;
  }
  scoreBoard.innerHTML = `Score: ${score}`;
};



const player = {
    pos: { x: 5, y: 5 },
    matrix: createPiece("T"),
};

update();

