let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = "pvp"; // ou 'pve'
let active = true;

const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function setMode(mode) {
    gameMode = mode;
    resetGame();
    document.getElementById('status').innerText = mode === 'pvp' ? "Vez do X" : "Você é o X";
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => handleMove(cell.getAttribute('data-index')));
});

function handleMove(index) {
    if (board[index] !== "" || !active) return;

    makeMove(index, currentPlayer);
    
    if (checkWin(board, currentPlayer)) {
        endGame(`Jogador ${currentPlayer} venceu!`);
        return;
    }

    if (board.every(cell => cell !== "")) {
        endGame("Empate!");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    
    if (gameMode === 'pve' && currentPlayer === "O") {
        setTimeout(botMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index='${index}']`);
    cell.innerText = player;
    cell.classList.add('taken');
}

function botMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    handleMove(move);
}

// Algoritmo Minimax simplificado
function minimax(newBoard, depth, isMaximizing) {
    if (checkWin(newBoard, "O")) return 10;
    if (checkWin(newBoard, "X")) return -10;
    if (newBoard.every(c => c !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "O";
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "X";
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(b, player) {
    return winConditions.some(cond => cond.every(i => b[i] === player));
}

function endGame(msg) {
    document.getElementById('status').innerText = msg;
    active = false;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    active = true;
    document.querySelectorAll('.cell').forEach(c => c.innerText = "");
    document.getElementById('status').innerText = "Vez do X";
}
