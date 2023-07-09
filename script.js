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

  return {
    addToken,
    getValue,
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

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    gameBoard.placeToken(row, column, getActivePlayer().token);

    isVictory();

    switchTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: gameBoard.getBoard,
  };
}

function ScreenController() {
  const game = GameController("X", "O");
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const singleButton = document.querySelector("#single");
  const multiButton = document.querySelector("#multi");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    if (isVictory().getWinCheck() === true) {
      playerTurnDiv.textContent = `X wins!`;
    } else if (isVictory().getWinCheck() === false) {
      playerTurnDiv.textContent = `O wins!`;
    }

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

  winConditions.forEach((i) => {
    let xFilter = xArray.filter((element) => i.includes(element));
    let oFilter = oArray.filter((element) => i.includes(element));

    if (xFilter.toString() === i.toString()) winCheck = true;
    else if (oFilter.toString() === i.toString()) winCheck = false;
  });
  const getWinCheck = () => winCheck;

  return {
    getWinCheck,
  };
}

ScreenController();
