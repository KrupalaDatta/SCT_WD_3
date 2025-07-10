const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const player = "X";       // You
const ai = "O";           // Computer

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  makeMove(index, player);

  if (!gameActive) return;

const aiIndex = getBestMove();
makeMove(aiIndex, ai);

}

function makeMove(index, current) {
  board[index] = current;
  cells[index].textContent = current;

  if (checkWinner(current)) {
    if (current === ai) {
statusText.innerHTML = "<span class='glitch'>💀 YOU LOST!</span>";
      
      // 🔊 Play Sound
      const aiSound = document.getElementById("aiSound");
      if (aiSound) aiSound.play();

      // 🌟 Red background effect
      document.body.style.background = "#300";
      document.body.style.transition = "background 0.5s";
      // 🧨 Shake the screen
document.body.classList.add("shake");

// Auto-remove shake after animation
setTimeout(() => {
  document.body.classList.remove("shake");
}, 400);

    } else {
      statusText.textContent = "🎉 You win!";
    }
    document.querySelector(".board").classList.add("flicker");
    gameActive = false;

  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;

  } else {
    statusText.textContent = `${current === player ? "Computer's turn..." : "Your turn"}`;
  }
}


function checkWinner(p) {
  return winConditions.some(([a, b, c]) => 
    board[a] === p && board[b] === p && board[c] === p
  );
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  gameActive = true;
  statusText.textContent = "Your turn";
  document.body.style.background = ""; // Reset glow

  // ✨ Remove flicker
  document.querySelector(".board").classList.remove("flicker");
}

statusText.textContent = "Your turn";

// 🔥 Minimax – AI Hard Mode
function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";

      // Add priority boost
      if (i === 4) score += 3;              // center
      else if ([0, 2, 6, 8].includes(i)) score += 2; // corners
      else score += 1;                      // edges

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}


function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(ai)) return 10 - depth;
  if (checkWinner(player)) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = ai;
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = player;
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}
