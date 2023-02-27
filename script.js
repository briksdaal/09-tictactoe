const BOARDLENGTH = 3;

const Cell = () => {
  const emptyVal = '-';
  let value = emptyVal;

  const changeCell = (playerMark) => {
    value = playerMark;
  };

  const getValue = () => value;

  const isEmpty = () => value === emptyVal;

  const reset = () => { value = emptyVal; };

  return {
    changeCell,
    getValue,
    isEmpty,
    reset,
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

  const reset = () => {
    for (let i = 0; i < BOARDLENGTH; i += 1) {
      for (let j = 0; j < BOARDLENGTH; j += 1) {
        board[i][j].reset();
      }
    }
  };

  return {
    getBoard,
    markCell,
    reset,
  };
})();

const Player = (name, mark) => ({ name, mark });

const GameController = ((player1, player2) => {
  const board = GameBoard;
  let activePlayer;
  let isGameOver;
  let isTie;
  let movesMade;

  const waitingPlayer = () => (activePlayer === player1 ? player2 : player1);

  const switchPlayerTurn = () => {
    activePlayer = waitingPlayer();
  };

  const getActivePlayer = () => activePlayer;

  const getGameStatus = () => ({ isGameOver, isTie });

  const gameEnded = (lastMoveRow, lastMoveCol) => {
    const curBoard = board.getBoard().map((row) => row.map((cell) => cell.getValue()));

    if (curBoard[lastMoveRow][0] === curBoard[lastMoveRow][1]
        && curBoard[lastMoveRow][1] === curBoard[lastMoveRow][2]) { return true; }

    if (curBoard[0][lastMoveCol] === curBoard[1][lastMoveCol]
        && curBoard[1][lastMoveCol] === curBoard[2][lastMoveCol]) { return true; }

    if (lastMoveRow === lastMoveCol) {
      if (curBoard[0][0] === curBoard[1][1]
        && curBoard[1][1] === curBoard[2][2]) { return true; }
    }

    if (+lastMoveRow + 1 === BOARDLENGTH - +lastMoveCol) {
      if (curBoard[2][0] === curBoard[1][1]
        && curBoard[1][1] === curBoard[0][2]) { return true; }
    }

    if (movesMade === BOARDLENGTH * BOARDLENGTH) {
      isTie = true;
      return true;
    }

    return false;
  };

  const playRound = (row, col) => {
    if (isGameOver) { return; }

    if (board.markCell(row, col, activePlayer.mark)) {
      movesMade += 1;
      if (gameEnded(row, col)) {
        isGameOver = true;
      } else {
        switchPlayerTurn();
      }
    }
  };

  const reset = () => {
    board.reset();
    activePlayer = player1;
    isGameOver = false;
    isTie = false;
    movesMade = 0;
  };

  reset();

  return {
    playRound,
    getActivePlayer,
    reset,
    getBoard: board.getBoard,
    getGameStatus,
  };
})(Player('Ash', '×'), Player('Gary', 'O'));

const ScreenController = (() => {
  const game = GameController;

  const statusDiv = document.querySelector('.status');
  const boardDiv = document.querySelector('.board');
  const resetBtn = document.querySelector('.reset-btn');
  let renamePlayer1;
  let renamePlayer2;

  const updateScreen = () => {
    boardDiv.innerHTML = '';

    const board = game.getBoard();
    const activePlayer = (() => {
      const currentPlayer = game.getActivePlayer().name;
      if (currentPlayer === 'Ash' && renamePlayer1) {
        return renamePlayer1;
      } if (currentPlayer === 'Gary' && renamePlayer2) {
        return renamePlayer2;
      }
      return currentPlayer;
    })();

    if (game.getGameStatus().isGameOver) {
      if (game.getGameStatus().isTie) {
        statusDiv.textContent = 'Over in a tie...';
      } else {
        statusDiv.textContent = `${activePlayer} won the game!`;
      }
    } else {
      statusDiv.textContent = `${activePlayer}'s turn...`;
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellBtn = document.createElement('button');
        cellBtn.classList.add('cell');
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.col = colIndex;
        if (cell.isEmpty()) {
          cellBtn.dataset.sign = 'empty';
        } else {
          cellBtn.dataset.sign = cell.getValue() === 'O' ? 'circle' : 'ex';
          cellBtn.textContent = cell.getValue();
        }

        boardDiv.appendChild(cellBtn);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.col;

    if (selectedRow && selectedColumn) {
      game.playRound(selectedRow, selectedColumn);
      updateScreen();
    }
  }

  boardDiv.addEventListener('click', clickHandlerBoard);
  resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const { form } = e.target;
    renamePlayer1 = form.player1.value;
    renamePlayer2 = form.player2.value;
    resetBtn.textContent = 'Reset';
    game.reset();
    updateScreen();
  });
  updateScreen();
})();
