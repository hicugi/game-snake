const SPEED = 256;
const BOARD_SIZE = 64; // pixels
const ACTIVE_CLASS_NAME = "snake";
const FOOD_CLASS_NAME = "food";

const game = document.querySelector("#game");
const gameBoard = Array.from(
  { length: BOARD_SIZE },
  () => new Array(BOARD_SIZE),
);
const activeList = [[0, 0]];
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

  activateCell(0, 0);
})();

function hideOverlay() {
  const elm = document.querySelector(".overlay");
  elm.classList.add("overlay--hide");
}

function insertFood() {
  const prevFood = game.querySelector(FOOD_CLASS_NAME);
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
  alert("Game over");
}

function startEngine() {
  function move(r, c) {
    if (r === BOARD_SIZE || r < 0 || c === BOARD_SIZE || c < 0) {
      gameOver();
      return;
    }

    activateCell(r, c);

    let current = [r, c];
    for (let i = 0; i < activeList.length; i++) {
      const v = activeList[i];
      activeList[i] = current;
      current = v;
    }

    if (r === foodLocation[0] && c === foodLocation[1]) {
      activeList.push(current);
      insertFood();
      return;
    }

    gameBoard[current[0]][current[1]].classList.remove(ACTIVE_CLASS_NAME);
    return;
  }

  engineInterval = setInterval(() => {
    switch (direction) {
      case "R":
        const [r, c] = activeList[0];
        move(r, c + 1);
        break;
    }
  }, SPEED);
}

function start() {
  hideOverlay();
  insertFood();
  startEngine();
}
