const Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

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

  const printBoard = () => {
    let boardString = "";
    for (let i = 0; i < rows; i++) {
      let row = "";
      for (let j = 0; j < columns; j++) {
        row += board[i][j].getValue() + " ";
      }
      boardString += row.trim() + "\n";
    }
    console.log(boardString);
  };

  return { getBoard, dropToken, printBoard, getRowValues, getColumnValues };
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
  const playerName = name;
  const playerToken = token;

  const getName = () => playerName;
  const getToken = () => playerToken;

  return { getName, getToken };
}

const GameController = function () {
  const Players = [player("Jasmine", "X"), player("Ovett", "O")];
  let activePlayer = Players[0];
  let gameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === Players[0] ? Players[1] : Players[0];
  };

  const getActivePlayer = () => activePlayer;

  const allTokensMatch = (values, token) =>
    values.every((value) => value === token);

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().getName()}'s turn.`);
  };

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

  const playRound = (row, column) => {
    if (gameOver) {
      console.log("Game over. No more moves allowed.");
      return;
    }

    console.log(
      `Dropping ${getActivePlayer().getName()}'s ${getActivePlayer().getToken()} into ${row}, ${column}.`
    );
    Gameboard.dropToken(row, column, getActivePlayer().getToken());

    /* Check for winner */
    if (rowWin()) {
      console.log(`${getActivePlayer().getName()} wins the row!`);
      gameOver = true;
      Gameboard.printBoard();
      return;
    }

    if (columnWin()) {
      console.log(`${getActivePlayer().getName()} wins the column!`);
      gameOver = true;
      Gameboard.printBoard();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  /* Print Initial Round */
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    rowWin,
    columnWin,
  };
};

// Start the game
const game = GameController();
