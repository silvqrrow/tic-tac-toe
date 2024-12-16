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

  return { getBoard, dropToken, printBoard };
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
  // GameController logic here
  const Players = [player("Jasmine", "X"), player("Ovett", "O")];

  let activePlayer = Players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === Players[0] ? Players[1] : Players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().getName()}'s turn.`);
  };

  const rowWin = () => {
    const firstRow = Gameboard.getBoard()[0];
    const secondRow = Gameboard.getBoard()[1];
    const thirdRow = Gameboard.getBoard()[2];
    /* Extract Cells in the Row */
    const firstRowValues = firstRow.map((cell) => cell.getValue());
    const secondRowValues = secondRow.map((cell) => cell.getValue());
    const thirdRowValues = thirdRow.map((cell) => cell.getValue());
    /* Check if it fits the current player token*/
    const firstRowCheck = firstRowValues.every(
      (value) => value == getActivePlayer().getToken()
    );
    const secondRowCheck = secondRowValues.every(
      (value) => value == getActivePlayer().getToken()
    );
    const thirdRowCheck = thirdRowValues.every(
      (value) => value == getActivePlayer().getToken()
    );

    return firstRowCheck || secondRowCheck || thirdRowCheck;
  };

  const playRound = (row, column) => {
    console.log(
      `Dropping ${getActivePlayer().getName()}'s ${getActivePlayer().getToken()} into ${row}, ${column}.`
    );
    Gameboard.dropToken(row, column, getActivePlayer().getToken());

    /* TODO: check for winner*/
    if (rowWin()) {
      console.log(`${getActivePlayer().getName()} wins the row!`);
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
  };
};

// Start the game
const game = GameController();
