const SPEED = 180;
const BOARD_SIZE = 16; // pixels
const ACTIVE_CLASS_NAME = "snake";
const FOOD_CLASS_NAME = "food";

const KEY_MAPPING = {
  w: "U",
  d: "R",
  s: "D",
  a: "L",

  // for vim practice
  k: "U",
  l: "R",
  j: "D",
  h: "L",

  ArrowUp: "U",
  ArrowRight: "R",
  ArrowDown: "D",
  ArrowLeft: "L",
};

const game = document.querySelector("#game");
const gameBoard = Array.from(
  { length: BOARD_SIZE },
  () => new Array(BOARD_SIZE),
);
let activeList = [[0,0]];
let direction = "R";
let nextDirection = "R";
let foodLocation = null;

/**
 * @param {number} row
 * @param {number} cell
 */
function activateCell(r, c) {
  gameBoard[r][c].classList.add(ACTIVE_CLASS_NAME);
  gameBoard[r][c].isActive = true;
}
/**
 * @param {number} row
 * @param {number} cell
 */
function deactivateCell(r, c) {
  gameBoard[r][c].classList.remove(ACTIVE_CLASS_NAME);
  gameBoard[r][c].isActive = false;
}

(() => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    const tr = document.createElement("TR");
    for (let c = 0; c < BOARD_SIZE; c++) {
      const td = document.createElement("TD");
      tr.appendChild(td);

      gameBoard[r][c] = td;
    }
    game.appendChild(tr);
  }

  activateCell(0, 0);
})();

function setupStartingPoint() {
  activeList = [[0, 0]];
  direction = "R";
  nextDirection = "R";
  activateCell(0, 0);
  updateScore();
}
function hideOverlays() {
  document.querySelectorAll(".overlay").forEach((elm) => {
    elm.classList.add("overlay--hide");
  });
}

function insertFood() {
  const prevFood = game.querySelector(`.${FOOD_CLASS_NAME}`);
  if (prevFood) prevFood.classList.remove(FOOD_CLASS_NAME);

  const availableCells = (() => {
    const result = new Array(BOARD_SIZE ** 2 - activeList.length);
    let idx = 0;

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (gameBoard[r][c].isActive) continue;
        result[idx] = [r, c];
        idx += 1;
      }
    }

    return result;
  })();

  const idx = parseInt(Math.random() * availableCells.length);
  const [r, c] = availableCells[idx];
  gameBoard[r][c].classList.add(FOOD_CLASS_NAME);
  foodLocation = [r, c];
}

let engineInterval = null;
/**
 * @param {boolean} isWin
 */
function gameOver(isWin = false) {
  clearInterval(engineInterval);

  let overlayId = "restart";
  if (isWin) {
    overlayId = "win";
  }

  const overlay = document.querySelector(`#${overlayId}`);
  overlay.classList.remove("overlay--hide");
  overlay.querySelector("button").focus();
}

function updateScore() {
  document.querySelector("#score").innerText = activeList.length;
}

function move(r, c) {
  if (r === BOARD_SIZE || r < 0 || c === BOARD_SIZE || c < 0) {
    gameOver();
    return;
  }

  activateCell(r, c);

  let current = [r, c];
  for (let i = 0; i < activeList.length; i++) {
    const v = activeList[i];

    if (v[0] === r && v[1] === c) {
      gameOver();
      return;
    }

    activeList[i] = current;
    current = v;
  }

  if (r === foodLocation[0] && c === foodLocation[1]) {
    if (activeList.length === BOARD_SIZE ** 2 - 1) {
      gameOver(true);
      return;
    }

    activeList.push(current);
    insertFood();
    updateScore();
    return;
  }

  deactivateCell(current[0], current[1]);
  return;
}

function startEngine() {
  setupStartingPoint();

  document.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).forEach((elm) => {
    elm.classList.remove(ACTIVE_CLASS_NAME);
  });

  engineInterval = setInterval(() => {
    const [r, c] = activeList[0];

    switch (nextDirection) {
      case "R":
        move(r, c + 1);
        break;

      case "L":
        move(r, c - 1);
        break;

      case "U":
        move(r - 1, c);
        break; case "D":
        move(r + 1, c);
        break;
    }

    direction = nextDirection;
  }, SPEED);
}

function start() {
  hideOverlays();
  setupStartingPoint();
  insertFood();
  startEngine();
}

/**
 * @param {string} value - U, R, D, L direction values
 */
function moveDirection(value) {
  if (value === undefined) return;

  if (direction + value === "UD") return;
  if (direction + value === "DU") return;
  if (direction + value === "LR") return;
  if (direction + value === "RL") return;

  nextDirection = value;
}

document.body.addEventListener("keydown", (e) => {
  const { key } = e;
  moveDirection(KEY_MAPPING[key]);
});
