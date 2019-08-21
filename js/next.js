const next = document.getElementById("next");
const nextContext = next.getContext("2d");

nextContext.scale(15, 15);

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
