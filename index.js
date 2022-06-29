const $boardList = document.querySelectorAll(".board-item");
const $score1 = document.querySelector(".score-1");
const $score2 = document.querySelector(".score-2");
const $winnerName = document.querySelector(".winner-text");
const $playerField1 = document.querySelector(".player-field-1");
const $playerField2 = document.querySelector(".player-field-2");
const $historyMoveList = document.querySelector(".history-move-list");
const $matchHistoryList = document.querySelector(".match-history-list");
const $switcherBOT = document.querySelector(".switcher_player");
const $switcherBestOf = document.querySelector(".switcher_match");

let currentMove = "x";
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let gameStart = true;
let bestOf = 3;

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

function printMoveHistory(move, playerName, boardIndex) {
  const dictionaryIndexBoard = [
    "Primeiro",
    "Segundo",
    "Terceiro",
    "Quarto",
    "Quinto",
    "Sexto",
    "Sétimo",
    "Oitavo",
    "Nono",
  ];
  $historyMoveList.innerHTML += `
  <li class="history-move" index="2">
    <span class="history-move-letter">${move}</span>
     <div class="history-move-text-wrapper">
        <h3 class="history-move-player-name">${playerName}</h3>
        <span class="history-move-position-text">${boardIndex}</span>
      </div>
  </li>
`;
}

function toggleMove() {
  currentMove = currentMove == "x" ? "0" : "x";
}

function printWinnerName(winnerName) {
  $winnerName.textContent = winnerName;
}

function getScenery() {
  const scenery = [];

  for (const $board of $boardList) {
    const move = $board.textContent;
    scenery.push(move);
  }
  return scenery;
}

function verifyBestOf() {
  if (scorePlayer1 === 2 && bestOf === 3) {
    return "x";
  }
  if (scorePlayer1 === 3 && bestOf === 5) {
    return "x";
  }
  if (scorePlayer2 === 2 && bestOf === 3) {
    return "o";
  }
  if (scorePlayer2 === 3 && bestOf === 5) {
    return "o";
  }
}

function printMatchHistory(winner, scenery) {
  let miniBoardScenery = "";

  for (const move of scenery) {
    miniBoardScenery += `<span class= 'mini-board-item'>${move}</span`;
  }

  $matchHistoryList.innerHTML += `
  <li class="match-history-item">
    <div class="winner-wrapper" >
      <strong class="winner-history-title title--green-small title" >Vencedor</strong>
      <span class="winner-history-name">${winner}</span>
    </div>
      <span class="scenery-label">Cenário</span>
      <div class="mini-board">${miniBoardScenery}
      </div>
 </li>`;
}

function verifyGame() {
  let filledFields = "0";

  for (const condition of winConditions) {
    const fieldIndex0 = condition[0];
    const fieldIndex1 = condition[1];
    const fieldIndex2 = condition[2];

    const $field1 = $boardList[fieldIndex0];
    const $field2 = $boardList[fieldIndex1];
    const $field3 = $boardList[fieldIndex2];

    if (
      $field1.innerHTML != "" &&
      $field1.innerHTML == $field2.innerHTML &&
      $field2.innerHTML == $field3.innerHTML
    ) {
      return currentMove;
    }
  }

  for (const $field of $boardList) {
    if ($field.innerHTML != "") filledFields++;
  }
  if (filledFields == 9) return "draw";
}

function resetHistoryList() {
  $historyMoveList.innerHTML = "";
}

function resetScorboard() {
  $score1.textContent = "00";
  $score2.textContent = "00";
}

function resetBattleField() {
  for (const $boardItem of $boardList) {
    $boardItem.innerHTML = "";
  }
}

function toggleBestOf() {
  bestOf = bestOf === 3 ? 5 : 3;
}

function bot() {
  const randonNumber = Math.random() * 9;
  const index = Math.floor(randonNumber);
  const $boardItem = $boardList[index];

  const game = verifyGame();

  if ($boardItem.textContent != "" && game != "draw") return bot();

  move(index, "bot");
}

function move(boardIndex, type) {
  const $boardItem = $boardList(boardIndex);

  if ($boardItem.innerHTML != "") return;

  $boardItem.innerHTML = currentMove;
  const gameResult = verifyGame();
  const scenery = getScenery();

  const playerName =
    currentMove === "x" ? $playerField1.value : $playerField2.value;

  if (gameResult === "x" || gameResult === "o") {
    gameStart = false;
    addPoint(gameResult);
    printScore();
    printWinnerName(playerName);
    setTimeout(resetBattleField, 1000);
    setTimeout(resetHistoryList, 1000);
    printMatchHistory(playerName, scenery);
    setTimeout(function () {
      gameStart = true;
    }, 1000);
  }

  if (gameResult == "draw") {
    gameStart = false;
    setTimeout(resetBattleField, 1000);
    setTimeout(resetHistoryList, 1000);
    printMatchHistory("Empate", scenery);
    setTimeout(function () {
      gameStart = true;
    }, 1000);
  }

  const bestOfResult = verifyBestOf();

  printMoveHistory(currentMove, playerName, boardIndex);
  toggleMove();
  if (type === "user" && botActive) bot();
  if (bestOfResult !== undefined) resetScorboard();
  scorePlayer1 = 0;
  scorePlayer2 = 0;
}

function addPoint(winner) {
  if (winner == "x") scorePlayer1++;
  if (winner == "0") scorePlayer2++;
}

function printScore() {
  if (scorePlayer1 < 10) {
    $score1.innerHTML = "0" + scorePlayer1;
  } else {
    $score1.innerHTML = scorePlayer1;
  }

  $score2.innerHTML = scorePlayer2 < 10 ? "0" + scorePlayer2 : scorePlayer2;
}

function addBoardListeners() {
  for (let index = 0; index < $boardList.length; index++) {
    const $boardItem = $boardList[index];

    $boardItem.addEventListener("click", function () {
      move(index, "user");
    });
  }
}
addBoardListeners();

$switcher.addEventListener("click", function () {
  $switcher.classList.toggle("active");
  botActive = !botActive;
  $playerField2.value = botActive ? "BOT" : "";
  $playerField2.disabled = !$playerField2.disabled;
});

$switcherBestOf.addEventListener("click", function () {
  $switcherBestOf.classList.toggle("active");
  toggleBestOf();
});

// Aula 26
