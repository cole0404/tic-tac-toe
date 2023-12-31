const gameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, player) => {
    if (board[row][column].getValue() !== "") return;

    board[row][column].addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    return boardWithCellValues.flat();
  };

  return {
    getBoard,
    placeToken,
    printBoard,
  };
})();

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  const clearValue = () => (value = "");

  return {
    addToken,
    getValue,
    clearValue,
  };
}

function GameController(playerOne, playerTwo) {
  const players = [
    {
      name: playerOne,
      token: "X",
    },
    {
      name: playerTwo,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const resetPlayer = () => {
    activePlayer = players[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    gameBoard.placeToken(row, column, getActivePlayer().token);

    isVictory();

    switchTurn();
  };

  return {
    playRound,
    getActivePlayer,
    resetPlayer,
    getBoard: gameBoard.getBoard,
  };
}

function ScreenController() {
  const game = GameController("X", "O");
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const singleButton = document.querySelector("#single");
  const multiButton = document.querySelector("#multi");
  const resetButton = document.createElement("button");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const winCheck = isVictory().getWinCheck();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    if (winCheck === "win") {
      playerTurnDiv.textContent = `X wins!`;
    } else if (winCheck === "lose") {
      playerTurnDiv.textContent = `O wins!`;
    } else if (winCheck === "tie") {
      playerTurnDiv.textContent = "Tie, nobody wins!";
    }

    if (winCheck === "win" || winCheck === "lose" || winCheck === "tie")
      addResetButton();

    board.forEach((row, zIndex) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = zIndex;
        cellButton.dataset.column = index;

        cellButton.textContent = cell.getValue();
        if (cellButton.textContent === "X") {
          cellButton.classList.add("x");
        } else if (cellButton.textContent === "O") {
          cellButton.classList.add("o");
        }
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clearPopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("invisible").style.display = "none";
  }

  function addResetButton() {
    document.getElementById("invisible").style.display = "block";
    resetButton.classList.add("reset");
    resetButton.textContent = `Click here to restart`;
    playerTurnDiv.append(resetButton);
    resetButton.addEventListener("click", resetGame);
  }

  function resetGame() {
    const board = game.getBoard();
    document.getElementById("popup").style.display = "grid";
    resetButton.remove();
    game.resetPlayer();
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.clearValue();
      });
    });

    updateScreen();
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;
    game.playRound(selectedRow, selectedColumn);

    updateScreen();
  }
  multiButton.addEventListener("click", clearPopup);
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

function isVictory() {
  let winCheck;
  let xFilter = [];
  let oFilter = [];

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const xArray = gameBoard.printBoard().reduce((r, n, i) => {
    n === "X" && r.push(i);
    return r;
  }, []);

  const oArray = gameBoard.printBoard().reduce((r, n, i) => {
    n === "O" && r.push(i);
    return r;
  }, []);

  const boardCells = () =>
    gameBoard.getBoard().map((row) => row.map((cell) => cell.getValue()));

  winConditions.forEach((i) => {
    xFilter.push(xArray.filter((element) => i.includes(element)));
    oFilter.push(oArray.filter((element) => i.includes(element)));
  });

  xFilter.forEach((i) => {
    if (i.length === 3) winCheck = "win";
  });

  oFilter.forEach((i) => {
    if (i.length === 3) winCheck = "lose";
  });

  if (boardCells().flat().indexOf("") === -1) {
    if (winCheck === undefined) winCheck = "tie";
  }
  const getWinCheck = () => winCheck;
  return {
    getWinCheck,
  };
}

ScreenController();
