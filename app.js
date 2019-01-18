let world = document.getElementById('world')
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
let gameRunning = true;

let shapes = {
  box: {
    startingIndices: [[0, 0], [0, 1], [1, 0], [1, 1]],
    val: 1,

  },

  t: {
    startingIndices: [[0, 0], [1, 0], [2, 0], [1, 1]],
    val: 2,
    
  },

  line: {
    startingIndices: [[0, 0], [1, 0], [2, 0], [3, 0]],
    val: 3,
  },

  t: {
    startingIndices: [[0, 0], [1, 0], [2, 0], [1, 1]],
    val: 4,
  },

  l: {
    startingIndices: [[0, 0], [1, 0], [2, 0], [0, 1]],
    val: 5,
  },

  reverseL: {
    startingIndices: [[2, 1], [1, 1], [0, 0], [0, 1]],
    val: 6,
  },

  s: {
    startingIndices: [[1, 0], [2, 0], [1, 1], [0, 1]],
    val: 7,
  },
  z: {
    startingIndices: [[0, 0], [1, 0], [1, 1], [2, 1]],
    val: 8,
  }
};

let shapeKeyBag = [];
let currentShape;
let nextShape;
let height = 15;
let width = 10;
let center = Math.floor(width / 2);
let state = 1;
let colors = ['blue', 'red', 'orange'];
let move = 0;
let occupiedBlocks = [];
let direction = "";
let score = 0;

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
    console.log(e.keyCode);
    let direction;
    e.preventDefault();
    switch (e.keyCode) {
        case 40:
            direction = "down";
            break;
        case 37:
            direction = "left";
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
    return shuffle(Object.keys(shapes));
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
    if (!shapeKeyBag.length) {
        shapeKeyBag = replenishShapeBag();        
    }
    let shape = shapeKeyBag.pop();
    let location = [0, center];

    shapes[shape].startingIndices.forEach(coord => {
        grid[location[0] + coord[0]][location[1] + coord[1]] = shapes[shape].val;
    })
}

function drawWorld() {
    while (world.lastChild) {
        world.removeChild(world.lastChild);
    }
    let square;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
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

function moveShapes(direction) {
    let canMove = true
    let vector = vectorMap[direction];
    switch (direction) {
        case "up":
            rotateShape();
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
            }
            break;

        default:
            break;
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
    createShape();
}

function hardDown() {

}

function clearLines() {
    for (let y = 0; y < grid.length; y++) {
        if (!grid[y].includes(0)) {
            grid.splice(y, 1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
    }
}

function gameLoop() {
    drawWorld();
    moveShapes("down");
    setTimeout(gameLoop, 500);
}

function start() {
    drawWorld();
    createShape();
    gameLoop();

}

start();