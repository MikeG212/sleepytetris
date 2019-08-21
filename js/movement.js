let keepHardDropping;

function move(dir) {
  currentPiece.pos.x += dir;
  if (collide(grid, currentPiece)) {
    currentPiece.pos.x -= dir;
  }
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function currentPieceRotate(dir) {
  const pos = currentPiece.pos.x;
  let offset = 1;
  rotate(currentPiece.matrix, dir);
  while (collide(grid, currentPiece)) {
    if (currentPiece.type === "I") {
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

function hardDrop() {
  while (keepHardDropping) {
    drop();
    score += 5;
  }
}
