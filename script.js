const Cell = () => {
  let value = '-';

  const changeCell = (playerMark) => {
    value = playerMark;
  };

  const getValue = () => value;

  const isEmpty = () => value === '-';

  return {
    changeCell,
    getValue,
    isEmpty,
  };
};

const GameBoard = (() => {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let i = 0; i < rows; i += 1) {
    board[i] = [];
    for (let j = 0; j < cols; j += 1) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const markCell = (row, col, playerMark) => {
    const curCell = board[row][col];
    if (!curCell.isEmpty()) {
      return false;
    }

    curCell.changeCell(playerMark);
    return true;
  };

  const printBoard = () => {
    const boardForConsolePrinting = board.map((row) => row.map((cell) => cell.getValue()));
    console.table(boardForConsolePrinting);
  };

  return {
    getBoard,
    markCell,
    printBoard,
  };
})();

const Player = (name, mark) => ({ name, mark });

const player1 = Player('Ash', 'X');
const player2 = Player('Gary', 'O');

const GameController = ((player1, player2) => {
  const board = GameBoard;

  let activePlayer = player1;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn...`);
  };

  const playRound = (row, col) => {
    if (board.markCell(row, col, activePlayer.mark)) {
      switchPlayerTurn();
    }
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
})(player1, player2);
