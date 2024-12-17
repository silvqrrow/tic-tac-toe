/* GAME SETUP & LOGIC */

/* Board Functions */
const Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  const initializeBoard = () => {
    board = [];
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  initializeBoard();

  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() == 0) {
      board[row][column].addToken(player);
    } else {
      return;
    }
  };

  const getBoard = () => board;

  const getRowValues = (rowIndex) =>
    board[rowIndex].map((cell) => cell.getValue());

  const getColumnValues = (columnIndex) =>
    board.map((row) => row[columnIndex].getValue());

  const getFirstDiagonalValues = () => {
    const values = [];
    for (let i = 0; i < rows; i++) {
      values.push(board[i][i].getValue());
    }
    return values;
  };

  const getSecondDiagonalValues = () => {
    const values = [];
    for (let i = 0; i < rows; i++) {
      values.push(board[i][columns - 1 - i].getValue());
    }
    return values;
  };

  const resetBoard = () => {
    initializeBoard();
  };

  return {
    getBoard,
    dropToken,
    getRowValues,
    getColumnValues,
    getFirstDiagonalValues,
    getSecondDiagonalValues,
    resetBoard,
  };
})();

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function player(name, token) {
  let playerName = name;
  const playerToken = token;

  const getName = () => playerName;
  const getToken = () => playerToken;
  const setName = (name) => {
    playerName = name;
  };

  return { getName, getToken, setName };
}

/* Game logic function */
const GameController = function () {
  let defaultPlayerOne = player("Player One", "X");
  let defaultPlayerTwo = player("Player Two", "O");
  const Players = [defaultPlayerOne, defaultPlayerTwo];
  let activePlayer = Players[0];
  let gameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === Players[0] ? Players[1] : Players[0];
  };

  const getActivePlayer = () => activePlayer;

  const allTokensMatch = (values, token) =>
    values.every((value) => value === token);

  const rowWin = () => {
    const playerToken = getActivePlayer().getToken();
    return [0, 1, 2].some((rowIndex) =>
      allTokensMatch(Gameboard.getRowValues(rowIndex), playerToken)
    );
  };

  const columnWin = () => {
    const playerToken = getActivePlayer().getToken();
    return [0, 1, 2].some((columnIndex) =>
      allTokensMatch(Gameboard.getColumnValues(columnIndex), playerToken)
    );
  };

  const diagonalWin = () => {
    const playerToken = getActivePlayer().getToken();
    return (
      allTokensMatch(Gameboard.getFirstDiagonalValues(), playerToken) ||
      allTokensMatch(Gameboard.getSecondDiagonalValues(), playerToken)
    );
  };

  const Tie = () => {
    const board = Gameboard.getBoard();
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  const playRound = (row, column) => {
    if (gameOver) {
      return;
    }

    Gameboard.dropToken(row, column, getActivePlayer().getToken());

    // Check for win
    if (rowWin() || columnWin() || diagonalWin()) {
      gameOver = true;
      return "win";
    }

    // Check for tie
    if (Tie()) {
      gameOver = true;
      return "tie";
    }

    switchPlayerTurn();
    return "continue";
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    activePlayer = Players[0];
    gameOver = false;
  };

  return {
    playRound,
    getActivePlayer,
    rowWin,
    columnWin,
    diagonalWin,
    Tie,
    defaultPlayerOne,
    defaultPlayerTwo,
    resetGame,
  };
};

// Start the game
let game = GameController();

/* CREATION GRID */
function ScreenController() {
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const restartButton = document.getElementById("restartButton");

  const playerModal = document.querySelector(".dialog");
  const playerOneInput = document.getElementById("playerOne");
  const playerTwoInput = document.getElementById("playerTwo");
  const submitNamesButton = document.querySelector(".submit");

  submitNamesButton.addEventListener("click", function (event) {
    event.preventDefault();
    const playerOneName = playerOneInput.value || playerOneInput.placeholder;
    const playerTwoName = playerTwoInput.value || playerTwoInput.placeholder;
    game.defaultPlayerOne.setName(playerOneName);
    game.defaultPlayerTwo.setName(playerTwoName);
    playerOneInput.placeholder = playerOneName;
    playerTwoInput.placeholder = playerTwoName;
    playerModal.close();
    updateScreen();
  });
  restartButton.addEventListener("click", function () {
    game.resetGame();
    playerModal.showModal();
    updateScreen();
  });

  const updateScreen = () => {
    // Clear the board
    boardDiv.textContent = "";

    // Get the newest version of the board and player turn
    const board = Gameboard.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;

    // Render board rows and squares
    board.forEach((row, rowIndex) => {
      // Create a div for each row
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("grid__row");

      row.forEach((cell, columnIndex) => {
        // Create a button for each cell
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        // Add click event listener to handle the move
        cellButton.addEventListener("click", (e) => {
          const row = e.target.dataset.row;
          const column = e.target.dataset.column;
          // End the event listener if the cell is clicked has a value
          if (cell.getValue() !== 0) {
            return;
          }
          // Get result
          const result = game.playRound(row, column);
          if (result == "continue") {
            updateScreen();
          } else if (result == "win") {
            updateScreen();
            playerTurnDiv.textContent = `${activePlayer.getName()} wins!`;
          } else if (result == "tie") {
            updateScreen();
            playerTurnDiv.textContent = `It's a tie!`;
          }
        });

        // Append the cell button to the row div
        rowDiv.appendChild(cellButton);
      });

      // Append the row div to the board div
      boardDiv.appendChild(rowDiv);
    });
  };
  playerModal.showModal();
  // Initial screen update
  updateScreen();
}

// Initialize the ScreenController
ScreenController();
