let score = 0;
const scoreBoard = document.getElementById("scoreBoard");
function updateScore() {
  scoreBoard.innerHTML = `Score: ${score}`;
}
