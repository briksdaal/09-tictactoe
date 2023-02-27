const BOARDLENGTH = 3;

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
  const rows = BOARDLENGTH;
  const cols = BOARDLENGTH;
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

const player11 = Player('Ash', 'X');
const player22 = Player('Gary', 'O');

const GameController = ((player1, player2) => {
  const board = GameBoard;
  let activePlayer = player1;
  let isGameOver = false;
  let isTie = false;
  let movesMade = 0;

  const waitingPlayer = () => (activePlayer === player1 ? player2 : player1);

  const switchPlayerTurn = () => {
    activePlayer = waitingPlayer();
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn...`);
  };

  const gameEnded = (lastMoveRow, lastMoveCol) => {
    const curBoard = board.getBoard().map((row) => row.map((cell) => cell.getValue()));
    console.log(`${curBoard[lastMoveRow][0] === curBoard[lastMoveRow][1]
        && curBoard[lastMoveRow][1] === curBoard[lastMoveRow][2]}`);
    if (curBoard[lastMoveRow][0] === curBoard[lastMoveRow][1]
        && curBoard[lastMoveRow][1] === curBoard[lastMoveRow][2]) { return true; }

    if (curBoard[0][lastMoveCol] === curBoard[1][lastMoveCol]
        && curBoard[1][lastMoveCol] === curBoard[2][lastMoveCol]) { return true; }

    if (lastMoveRow === lastMoveCol) {
      if (curBoard[0][0] === curBoard[1][1]
        && curBoard[1][1] === curBoard[2][2]) { return true; }
    }

    if (lastMoveRow + 1 === BOARDLENGTH - lastMoveCol) {
      if (curBoard[2][0] === curBoard[1][1]
        && curBoard[1][1] === curBoard[0][2]) { return true; }
    }

    if (movesMade === BOARDLENGTH * BOARDLENGTH) {
      isTie = true;
      return true;
    }

    return false;
  };

  const gameOver = () => {
    isGameOver = true;
    if (isTie) {
      console.log('Over in a tie...');
    } else {
      console.log(`${activePlayer.name} won the game! Sorry ${waitingPlayer().name}...`);
    }
  };

  const playRound = (row, col) => {
    if (isGameOver) return;

    if (board.markCell(row, col, activePlayer.mark)) {
      movesMade += 1;
      if (gameEnded(row, col)) {
        gameOver();
      } else {
        switchPlayerTurn();
      }
    }
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
})(player11, player22);
