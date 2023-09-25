const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winnigMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton');
const winnigMessageTextElement = document.querySelector('[data-winningmessage-text]')
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);


function startGame() {
    circleTurn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    });
    setBoardHoverClass();
    winnigMessageElement.classList.remove('show');

}

function getRandomEmptyCellIndex() {
    const emptyCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS));
    if (emptyCells.length === 0) return null; // No empty cells left
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return Array.from(cellElements).indexOf(emptyCells[randomIndex]);
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);

    // Log the index of the cell pressed.
    const cellIndex = Array.from(cell.parentElement.children).indexOf(cell);
    console.log(`Clicked cell index: ${cellIndex}`);


    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns()
        setBoardHoverClass()

        // Add AI's turn here
        if (circleTurn) { 
            setTimeout(() => {
                const emptyCellIndex = bestMove();
                if (emptyCellIndex !== null) {
                    const emptyCell = cellElements[emptyCellIndex];
                    emptyCell.click(); // Simulate a click on the empty cell
                }
            }, 100); // Delay the AI's move for 1 second (adjust as needed)
        }
    }
}

function endGame(draw) {
    if (draw) {
        winnigMessageTextElement.innerHTML = `Draw!`
    } else {
        winnigMessageTextElement.innerHTML = `${circleTurn ? "O's" : "X's"} Wins!`
    }
    winnigMessageElement.classList.add('show')
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}


function evaluate(board) {
    if (checkWin(CIRCLE_CLASS)) {
        return 10;
    } else if (checkWin(X_CLASS)) {
        return -10;
    } 
    return 0;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -10,
        O: 10,
        draw: 0,
    };

    if (checkWin(CIRCLE_CLASS)) {
        return scores.O;
    }
    if (checkWin(X_CLASS)) {
        return scores.X;
    }
    if (isDraw()) {
        return scores.draw;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(CIRCLE_CLASS);
                const score = minimax(board, depth + 1, false);
                cellElements[i].classList.remove(CIRCLE_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(X_CLASS);
                const score = minimax(board, depth + 1, true);
                cellElements[i].classList.remove(X_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
            cellElements[i].classList.add(CIRCLE_CLASS);
            const score = minimax(board, 0, false);
            cellElements[i].classList.remove(CIRCLE_CLASS);
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}