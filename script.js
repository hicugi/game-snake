const game = document.querySelector("#game");

(() => {
  const BOARD_SIZE = 64; // pixels

  for (let r = 0; r < BOARD_SIZE; r++) {
    const tr = document.createElement("TR");
    for (let c = 0; c < BOARD_SIZE; c++) {
      const td = document.createElement("TD");
      tr.appendChild(td);
    }
    game.appendChild(tr);
  }

  game.querySelector("td").classList.add("active");
})();

function start() {
  alert("hey");
}
