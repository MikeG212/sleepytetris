const next = document.getElementById("next");
const nextContext = next.getContext("2d");

nextContext.scale(15, 15);

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
