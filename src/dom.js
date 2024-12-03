import { drawGrid, animateGrid } from "./dom_displays";
import { ui, ships, marks } from "./images";
import { Player } from "./player";
import { shipToPlace, placing_start, placing_finish } from "./dom_placing";
import { generateFleet } from "./ai";
import { battle_start } from "./dom_battle"
import { drawAbilities, refreshAbilityState, createPopUp } from "./dom_abilities";

export let player1 = new Player ("Bob", "human")
export let player2 = new Player ("AI", "ai");
export let displayedBoard = player2;
export let language = "eng";

export const containers = {
  background: document.getElementById("container_background"),
  game: document.getElementById("container_game"),
  head: {
    top: document.getElementById("container_headTop"),
    bottom: document.getElementById("container_headBottom"),
  },
  main: {
    frameLeft: document.getElementById("container_frameLeft"),
    frameRight: document.getElementById("container_frameRight"),
    sidebarLeft: document.getElementById("container_sidebarLeft"),
    sidebarRight: document.getElementById("container_sidebarRight"),
    center: {
      top: document.getElementById("container_centerTop"),
      middle: document.getElementById("container_centerMiddle"),
      bottom: document.getElementById("container_centerBottom"),
      gameboard: {
        self: document.getElementById("container_gameboardMain"),
        left: {
          self: document.getElementById("content_gameboardLeft"),
          cells: document.getElementById("container_cellsLeft"),
        },
        right: {
          self: document.getElementById("content_gameboardRight"),
          cells: document.getElementById("container_cellsRight"),
        },
      }
    },
  },
  abilities: {
    left: {},
  }
}

export function readyImg(src, id, classes = null) {
  let element = document.createElement("img");
  element.src = src;
  element.id = id;
  element.draggable = "false";
  if (classes) element.classList.add(...classes);

  let pointerEventsIgnoreList = [
    "buttonAllies",
    "buttonEnemies",
    "left_mine_icon",
    "left_torpedo_icon",
    "left_double_icon",
    "left_bomb_icon"
  ]

  if (!pointerEventsIgnoreList.includes(id)) element.style.pointerEvents = "none";
  return element
}

export function placeSVG(element, svgString, options = { id: null, classes: null }) {
  let parser = new DOMParser();
  let parsed = parser.parseFromString(svgString, 'image/svg+xml');
  let svg = parsed.documentElement
  if (options.id) svg.id = options.id
  if (options.classes) svg.classList.add(...options.classes)
  element.appendChild(svg);
}

export function draw_gameScreen() {
  drawElements_gameScreen(),
  drawGrid("left");
  drawGrid("right");
}

function drawElements_gameScreen() {
  containers.background.appendChild(readyImg(ui.background, "backgroundMain"));
  containers.head.top.appendChild(readyImg(ui.head.top, "headTop"));
  containers.head.bottom.appendChild(readyImg(ui.head.bottom, "headBottom"));
  containers.main.frameLeft.appendChild(readyImg(ui.frame.left, "frameLeft"));
  containers.main.frameRight.appendChild(readyImg(ui.frame.right, "frameRight"));
  containers.main.sidebarLeft.appendChild(readyImg(ui.main.sidebarLeft, "sidebarLeft"));
  containers.main.sidebarRight.appendChild(readyImg(ui.main.sidebarRight, "sidebarRight"));
  containers.main.center.middle.appendChild(readyImg(ui.main.center.middleBar, "middleBar"));
  containers.main.center.middle.appendChild(readyImg(ui.main.center.displayLeft, "displayLeft"));
  containers.main.center.middle.appendChild(readyImg(ui.main.center.displayRight, "displayRight"));
  containers.main.center.gameboard.self.appendChild(readyImg(ui.main.gameboard, "gameboard"));
  containers.main.center.gameboard.self.appendChild(readyImg(ui.main.center.buttonGray, "buttonAllies"));
  containers.main.center.gameboard.self.appendChild(readyImg(ui.main.center.buttonYellow, "buttonEnemies"));
}

export async function displayPlayerBoard(display) {
  await clearDisplay(display);

  //Draw ships
  let playerFleet = player1.gameboard.fleet;
  for (let ship of playerFleet) {
    !ship.sunk
      ? drawShip(ship, display, { id: `P1-${ship.type}` })
      : drawShip(ship, display, { classes: ["red"], id: `P1-${ship.type}` });
  }

  //Draw shots and mines
  let playerBoard = player1.gameboard.board;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let cell = playerBoard[y][x];
      let cellElement;
      display === "left"
        ? cellElement = document.getElementById(`dL-[${y},${x}]`)
        : cellElement = document.getElementById(`dR-[${y},${x}]`);
      //Draw shots
      if (cell.isHit) {
        let svgString; marks.dot;
        let classList = ["mark"];
        if (cell.ship) {
          svgString = marks.bang;
          classList.push("hit", "red", "bang")
        } else {
          svgString = marks.dot;
          classList.push("miss", "red", "dot");
        }

        placeSVG(cellElement, svgString, { classes: classList })
      }
      //Draw mines
      if (cell.ship && cell.ship.type === "mine") {
        !cell.ship.sunk
          ? drawShip(cell.ship, display, { mine: true, classes: [] })
          : drawShip(cell.ship, display, { classes: ["red"], mine: true });
      }
    }
  }
}

export async function displayEnemyBoard() {
  await clearDisplay("left");

  let playerFleet = player2.gameboard.fleet;
  for (let ship of playerFleet) {
    if (ship.sunk) drawShip(ship, "left", {classes: ["red"]})
  }

  let enemyBoard = player2.gameboard.board;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let cell = enemyBoard[y][x];
      let cellElement = document.getElementById(`dL-[${y},${x}]`);

      if (cell.isHit) {
        let svgString; marks.dot;
        let classList = ["mark"];
        if (cell.ship) {
          svgString = marks.bang;
          classList.push("hit", "red", "bang")
          if (cell.ship.type === "mine") {
            drawShip(cell.ship, "left", { classes: ["red"], mine: true });
          }
        } else {
          svgString = marks.dot;
          classList.push("miss", "green", "dot");
        }

        placeSVG(cellElement, svgString, {classes: classList})
      }
    }
  }
}

export async function clearDisplay(display) {
  return new Promise((resolve) => {
    let board;
    display === "left"
      ? board = document.getElementById("container_cellsLeft")
      : board = document.getElementById("container_cellsRight");
    let cells = Array.from(board.children);
    for (let cell of cells) cell.innerHTML = "";
    resolve();
  });
}

export async function drawShip(ship, display, options = {}) {
  let svgString = ships[`${ship.type}`];
  let classList;
  if (!options.mine) classList = [`${ship.type}`, `${ship.orientation}`];
  else classList = ["mine"]
  if (options.classes) options.classes.forEach(cls => classList.push(cls));
  
  let targetCellString;
  display === "left"
    ? targetCellString = `dL-[${ship.anchor}]`
    : targetCellString = `dR-[${ship.anchor}]`;
  
  const targetCell = document.getElementById(targetCellString);
  placeSVG(targetCell, svgString, {id: options.id, classes: classList})
}

export async function toggleDisplay(e) {
  let btnAllies = document.getElementById("buttonAllies");
  let btnEnemy = document.getElementById("buttonEnemies");
  let svgYellow = ui.main.center.buttonYellow;
  let svgGray = ui.main.center.buttonGray;

  clearDisplay("left")
  if (e.target.id === "buttonAllies") {
    displayedBoard = player1;
    await displayPlayerBoard("left");
    btnAllies.src = svgYellow;
    btnEnemy.src = svgGray;
  } else {
    displayedBoard = player2;
    await displayEnemyBoard();
    btnAllies.src = svgGray;
    btnEnemy.src = svgYellow;
  }
}



draw_gameScreen();
document.getElementById("buttonEnemies").addEventListener("click", toggleDisplay);
document.getElementById("buttonAllies").addEventListener("click", toggleDisplay);


animateGrid("left");
animateGrid("right");
generateFleet("player1")
generateFleet("player2")
await displayPlayerBoard("right");
await displayPlayerBoard("left");
await displayEnemyBoard()

drawAbilities("left")
drawAbilities("right")
refreshAbilityState(player1);
refreshAbilityState(player2);
battle_start();




