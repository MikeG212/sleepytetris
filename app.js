let world = document.getElementById('world');

const configs = ["pos1", "pos2", "pos3", "pos4"];

let next = document.getElementById("next");
let colorMap = {
    0: "black",
    1: "red",
    2: "orange",
    3: "yellow",
    4: "green",
    5: "blue",
    6: "indigo",
    7: "pink",

}



let scoreBoard = document.getElementById('scoreBoard');
let gameRunning = true;

const SHAPES = {
    o: [[1, 1], 
        [1, 1]],

    t: [[2, 2, 2]
        [0, 2, 0],
        [0, 0, 0]],

    i: [[3, 3, 3, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],

    l: [[4, 4, 4]
        [4, 0, 0],
        [0, 0, 0]],

    l: [[5, 5, 5]
        [0, 0, 5],
        [0, 0, 0]],

    s: [[0, 6, 6]
        [6, 6, 0],
        [0, 0, 0]],

    z: [[7, 7, 0]
        [0, 7, 7],
        [0, 0, 0]],
};

function deepDup(arr) {
    return arr.map(el => {
        if (el instanceof Array) {
            return deepDup(el)
        } else {
            return el;
        }
    });

}

function incrementCoord(y, x) {
  currentShape.indices.forEach(coord => {
    coord[0] += y;
    coord[1] += x;
  });
  currentShape.origin[0] += y;
  currentShape.origin[1] += x
}



let shapeKeyBag = replenishShapeBag();
let currentShape;
let height = 15;
let width = 10;
let center = Math.floor(width / 2);
let state = 1;
let score = 0;
let gameOver = false;

function resetGrid() {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
} 

let grid = resetGrid();

const vectorMap = {
    "left": { y: 0, x: -1, edge: 0},
    "right": { y: 0, x: 1, edge: grid[0].length - 1},
    "down": { y: 1, x: 0, edge: grid.length - 1}
};



document.onkeydown = function (e) {
    let direction;
    e.preventDefault();
    switch (e.keyCode) {
        case 40:
            direction = "down";
            score++;
            break;
        case 37:
            direction = "left";
            break;
        case 38:
            direction = "up";
            break;
        case 39:
            direction = "right";
            break;
        case 32:
            direction = "space";
            break;
        default:
            break;
    }
    moveShapes(direction)
    scoreBoard.innerHTML = `Score: ${score}`;
    drawWorld();
}

let resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
    grid = resetGrid();
    score = 0;
    start();
});

let pauseButton = document.getElementById("pause-button");
pauseButton.addEventListener("click", () => {
  gameRunning = false;
});

function replenishShapeBag() {
    return shuffle(Object.keys(SHAPES));
}

function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function createShape() {
    setNext();
    if (shapeKeyBag.length < 4) {
        let nextShapes = replenishShapeBag();
        shapeKeyBag = shapeKeyBag.concat(nextShapes);        
    }
    currentShape = SHAPES[shapeKeyBag.shift()];
    let start = [0, center];

    currentShape.indices.forEach(coord => {
        newY = location[0] + coord[0];
        newX = center + coord[1];
        grid[newY][newX] = currentShape.val;
        coord[0] = newY;
        coord[1] = newX;
    })
    debugger

    currentShape.origin[1] += center;
}

function drawWorld() {
    scoreBoard.innerHTML = `Score: ${score}`;
    while (world.lastChild) {
        world.removeChild(world.lastChild);
    }
    let square;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            // if (y < 2) {
            //     continue;
            // }
            square = document.createElement('div');
            square.classList.add("empty");
            square.style.backgroundColor = colorMap[grid[y][x] % 10];
            if (grid[y][x] === 0) {
                square.classList.add("empty");
            } else {
                square.classList.add("squareShape");
            }
            document.getElementById("world").appendChild(square);
        }
        world.innerHTML += "<br>"
    }
}

function containsLiveBlock(y, x) {
    return grid[y][x] > 0 && grid[y][x] < 10;
}


function moveOver(vector, y, x) {
    if (containsLiveBlock(y, x)) {
        grid[y + vector.y][x + vector.x] = grid[y][x];
        grid[y][x] = 0;
    }
}

function setNext() {
    next.innerHTML = `Next: ${shapeKeyBag.slice(0,4)}`;
}


function moveShapes(direction) {
    let canMove = true
    let vector = vectorMap[direction];
    switch (direction) {
        case "up":
            rotateCW();
            break;
        case "space":
            hardDown();
            break;
        case "left":
            for (let y = grid.length - 1; y >= 0; y--) {
              for (let x = 0; x < grid[y].length; x++) {
                if (containsLiveBlock(y, x)) {
                  if (x === vector.edge || grid[y + vector.y][x + vector.x] > 10) {
                    canMove = false;
                  }
                }
              }
            }

            if (canMove) {
                for (let y = grid.length - 1; y >= 0; y--) {
                    for (let x = 0; x < grid[y].length; x++) {
                        moveOver(vector, y, x);
                        }
                }
                incrementCoord(vector.y, vector.x);
            }
            break;
        
        case "right":
            for (let y = grid.length - 1; y >= 0; y--) {
              for (let x = grid[y].length; x >= 0; x--) {
                if (containsLiveBlock(y, x)) {
                  if (x === vector.edge || grid[y + vector.y][x + vector.x] > 10) {
                    canMove = false;
                  }
                }
              }
            }

            if (canMove) {
                for (let y = grid.length - 1; y >= 0; y--) {
                    for (let x = grid[y].length; x >= 0; x--) {
                            moveOver(vector, y, x);
                        }
                }
                incrementCoord(vector.y, vector.x);
            }
            break;

        case "down":
            for (let y = grid.length - 1; y >= 0; y--) {
                for (let x = 0; x < grid[y].length; x++) {
                    if (containsLiveBlock(y, x)) {
                        if (y === vector.edge || grid[y + vector.y][x + vector.x] > 10) {
                          canMove = false;
                          freeze();
                        }
                    }
                }
            }
            if (canMove) {
                for (let y = grid.length - 1; y >= 0; y--) {
                    for (let x = 0; x < grid[y].length; x++) {
                        moveOver(vector, y, x);
                    }
                }
                incrementCoord(vector.y, vector.x);
            }
            break;

        default:
            break;
    }
}

function gameOverCheck() {
    if (grid[0].filter(cell => !!cell).length || grid[1].filter(cell => !!cell).length) {
        gameOver = true;
        alert("GAME OVER");
    }
}

function freeze() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (containsLiveBlock(y, x)) {
                grid[y][x] += 10;
            }
        }
    }
    clearLines();
    gameOverCheck();
    createShape();
}

function hardDown() {

}

function rotateCW() {
    debugger
    let origin = currentShape.origin;
    let y;
    let x;
    for (let col = 0; col < 3; col ++) {
        for (let row = 0; row < 3; row++) {
            y = col - origin[0];
            x = row - origin[1];

            grid[col + displace.y][row + displace.x] = currentShape.val;
        }
    }
    currentShape.indices.forEach(coord => {
        coord[0] += displace.y;
        coord[1] += displace.x;
        grid [coord[0], coord[1]] = currentShape.val;
    });
}

function clearLines() {
    for (let y = 0; y < grid.length; y++) {
        counter = 0;
        if (!grid[y].includes(0)) {
            counter++;
            grid.splice(y, 1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            
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
}

function gameLoop() {
    drawWorld();
    moveShapes("down");
    setTimeout(gameLoop, 500);
}

function start() {
    createShape();
    gameLoop();

}

start();