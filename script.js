const SPEED = 180;
const BOARD_SIZE = 16; // pixels
const ACTIVE_CLASS_NAME = "snake";
const FOOD_CLASS_NAME = "food";

const KEY_MAPPING = {
  KeyW: "U",
  KeyD: "R",
  KeyS: "D",
  KeyA: "L",
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
let activeList = null;
let direction = "R";
let foodLocation = null;

/**
 * @param {number} row
 * @param {number} cell
 */
function activateCell(r, c) {
  gameBoard[r][c].classList.add(ACTIVE_CLASS_NAME);
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
})();

function hideOverlays() {
  document.querySelectorAll(".overlay").forEach((elm) => {
    elm.classList.add("overlay--hide");
  });
}

function insertFood() {
  const prevFood = game.querySelector(`.${FOOD_CLASS_NAME}`);
  if (prevFood) prevFood.classList.remove(FOOD_CLASS_NAME);

  const getRandom = () => parseInt(Math.random() * BOARD_SIZE);

  for (i = 0; i < 1e9; i++) {
    const r = getRandom();
    const c = getRandom();

    const isActive = gameBoard[r][c].classList.contains(ACTIVE_CLASS_NAME);
    if (isActive) continue;

    gameBoard[r][c].classList.add(FOOD_CLASS_NAME);
    foodLocation = [r, c];
    return;
  }

  alert("Couldn't generate a food");
}

let engineInterval = null;
function gameOver() {
  clearInterval(engineInterval);

  const overlay = document.querySelector("#restart");
  overlay.classList.remove("overlay--hide");
  overlay.querySelector("button").focus();
}

function updateScore() {
  document.querySelector("#score").innerText = activeList.length;
}

function startEngine() {
  activeList = [[0, 0]];
  direction = "R";
  activateCell(0, 0);
  updateScore();

  document.querySelectorAll(`.${ACTIVE_CLASS_NAME}`).forEach((elm) => {
    elm.classList.remove(ACTIVE_CLASS_NAME);
  });

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
      activeList.push(current);
      insertFood();
      updateScore();
      return;
    }

    gameBoard[current[0]][current[1]].classList.remove(ACTIVE_CLASS_NAME);
    return;
  }

  engineInterval = setInterval(() => {
    const [r, c] = activeList[0];

    switch (direction) {
      case "R":
        move(r, c + 1);
        break;

      case "L":
        move(r, c - 1);
        break;

      case "U":
        move(r - 1, c);
        break;

      case "D":
        move(r + 1, c);
        break;
    }
  }, SPEED);
}

function start() {
  hideOverlays();
  insertFood();
  startEngine();
}

document.body.addEventListener("keydown", (e) => {
  const { key } = e;
  const value = KEY_MAPPING[key];

  if (value === undefined) return;

  if (direction + value === "UD") return;
  if (direction + value === "DU") return;
  if (direction + value === "LR") return;
  if (direction + value === "RL") return;

  direction = value;
});
