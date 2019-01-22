let world = document.getElementById('world');

let next = document.getElementById("next");
let colorMap = {
    0: "black",
    1: "red",
    2: "orange",
    3: "yellow",
    4: "green",
    5: "blue",
    6: "indigo",
    7: "white",
    8: "pink"

}

const threeByThreeCW =
    [[{y: 0, x: 2}, {y: 1, x: 1}, { y: 2, x: 2}],
    [{y: -1, x: 1}, {y: 0, x: 0}, { y: 1, x: -1}],
    [{y: -2, x: 0}, {y: -1, x: -1}, {y: 0, x: -2}]];

let scoreBoard = document.getElementById('scoreBoard');
let gameRunning = true;

const SHAPES = {
    o: {
        startingIndices: [[0, 0], [0, 1], [1, 0], [1, 1]],
        val: 1,
        width: 2,

    },

    t: {
        startingIndices: [[1, 0], [0, 1], [1, 1], [1, 2]],
        val: 2,
        width: 3,

    },

    i: {
        startingIndices: [[0, 0], [0, 1], [0, 2], [0, 3]],
        val: 3,
        width: 4,
    },

    l: {
        startingIndices: [[0, 0], [1, 0], [1, 1], [1, 2]],
        val: 4,
        width: 3,
    },

    j: {
        startingIndices: [[1, 0], [1, 1], [1, 2], [0, 2]],
        val: 5,
        width: 3,
    },

    s: {
        startingIndices: [[1, 0], [2, 0], [1, 1], [0, 1]],
        val: 6,
        width: 3,
    },
    z: {
        startingIndices: [[0, 0], [1, 0], [1, 1], [2, 1]],
        val: 7,
        width: 3,
    }
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

function Shape(shape) {
    debugger
    this.name = shape;
    this.val = SHAPES[shape].val;
    this.indices = deepDup(SHAPES[shape].startingIndices);
    this.width = SHAPES[shape].width;
}

let shapeKeyBag = replenishShapeBag();
let currentShape;
let height = 15;
let width = 10;
let center = Math.floor(width / 2);
let state = 1;
let colors = ['blue', 'red', 'orange'];
let move = 0;
let occupiedBlocks = [];
let direction = "";
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
    currentShape = new Shape(shapeKeyBag.shift());
    let location = [0, center];

    currentShape.indices.forEach(coord => {
        debugger
        newY = location[0] + coord[0];
        newX = location[1] + coord[1];
        grid[newY][newX] = currentShape.val;
        coord[0] = newY;
        coord[1] = newX;
    })
}

function drawWorld() {
    scoreBoard.innerHTML = `Score: ${score}`;
    while (world.lastChild) {
        world.removeChild(world.lastChild);
    }
    let square;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (y < 2) {
                continue;
            }
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
        debugger
        grid[y + vector.y][x + vector.x] = grid[y][x];
        grid[y][x] = 0;
    }
}

function setNext() {
    next.innerHTML = `Next: ${shapeKeyBag.slice(0,4)}`;
}

function incrementCoord(y, x) {
    currentShape.indices.forEach(coord => {
        coord[0] += y;
        coord[1] += x;
    })
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
    locateShape()
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
    debugger
    setTimeout(gameLoop, 500);
}

function start() {
    createShape();
    gameLoop();

}

start();