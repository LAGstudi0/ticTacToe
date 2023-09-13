// Represent the state of the board.
function GameBoard() {
    // set variables for the columns and rows in order to generate the board
    var column = 3;
    var row = 3;
    const board = [];

    // create a 2D array to generate the board
    for ( let i = 0; i < row; i++ ) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push("[ ]");
        }
    }

    // Create a function that prints the board to the console
    const printBoard = () => {
        for ( let i = 0; i < row; i++ ) {
            console.log(board[i].join(" ") + "\n");
        }
    };

    // create function that sets the player token on the board
    const setCell = (row, col, player) => {
        if ( board[row][col] == "[ ]") {
            board[row][col] = player;
            return true;    // valid move
        }
        return false;       // invalid move
    };
    // checks if the user has put a token in a invalid location

    // Updates the game board.

    return {
        printBoard,
        setCell,
        getBoard: () => board,
    };
}

// function that check if user won
function CheckWin(board, player) {
    // Horizontal win
    for ( let row = 0; row < 3; row++) {
        if (
            board[row][0] === player &&
            board[row][1] === player &&
            board[row][2] === player
            ) {
                return true;
            }
    }

    // Vertical win
    for ( let col = 0; col < 3; col++) {
        if (
            board[0][col] === player &&
            board[1][col] === player &&
            board[2][col] === player
            ) {
                return true;
            }
    }
    if (
        (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
        (board[0][2] === player && board[1][1] === player && board[2][0] === player)
    ) {
        return true;
    }
    return false;
}

// Function that checks if its a draw.
function CheckDraw(board) {
    for ( let row = 0; row < 3; row++ ) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] == "[ ]") {
                return false; // there are still empty cells not filled
            }
        }
    }
    return true;    // all cells are filled, so its a draw.
}

// function that checks whose turn is it to play.
function startGame() {
    const gameBoard = GameBoard();
    let currentPlayer = "[X]";

    while (true) {
        console.clear();
        gameBoard.printBoard()
        console.log(`Player ${currentPlayer}\'s turn`);

        const row = parseInt(prompt("Enter row (0, 1, 2)"));
        const col = parseInt(prompt("Enter col (0, 1, 2)"));
        gameBoard.setCell(row, col, currentPlayer)

        if (
            row >= 0 &&
            row <= 2 &&
            col >= 0 &&
            col <= 2 &&
            gameBoard.setCell(row, col, currentPlayer)
        ) {
            if (CheckWin(gameBoard.getBoard(), currentPlayer)) {
                console.clear();
                gameBoard.printBoard();
                console.log(`Player ${currentPlayer}\'win`);
                break;
            }
            else if (CheckDraw(gameBoard.getBoard())) {
                console.clear();
                gameBoard.printBoard();
                console.log("It\'s a tie!");
                break;
            }
        currentPlayer = currentPlayer === "[X]" ? "[O]" : "[X]";

        }
        
        else {
            console.log("Invalid move");
        }
    }

}

startGame();