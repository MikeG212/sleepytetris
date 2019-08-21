let shapeBag;
let type;

let midpoint = (grid[0].length / 2) | 0;

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
