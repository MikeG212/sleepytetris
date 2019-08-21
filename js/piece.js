let shapeBag;
let type;

let midpoint = (grid[0].length / 2) | 0;

const colorMap = [
  "black",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "indigo",
  "pink",
  "brown"
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

const currentPiece = {
  pos: { x: midpoint, y: -2 },
  matrix: pieceMatrixHash[type],
  type: type
};

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
