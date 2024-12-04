import { drawGrid, animateGrid } from "./dom_displays";
import { ui, ships, marks, avatars } from "./images";
import { Player } from "./player";
import { placing_start, placing_finish } from "./dom_placing";
import { generateFleet } from "./ai";
import { battle_start } from "./dom_battle"
import { drawAbilities, } from "./dom_abilities";
import { translation } from "./translation";
import { battle_removeEventListeners_regularShot } from "./dom_battle";
import { currentVersion } from ".";


export let player1;
export let player2; 
export let displayedBoard = player2;
export let language = "eng";

export function displayVersion() {
  const version = document.createElement("div");
  version.innerText = currentVersion;
  version.classList.add("version");
  document.body.appendChild(version);
}


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

export function draw_mainFrame() {
  drawElements_mainFrame();
}

export function draw_startScreen() {
  let menuContainer = document.createElement("div");
  menuContainer.id = "container_menu";
  document.getElementById("container_center").appendChild(menuContainer);
  menuContainer.appendChild(readyImg(ui.logo, "logo"));

  let buttonsContainer = document.createElement("div");
  buttonsContainer.id = "container_menuBtns";
  menuContainer.appendChild(buttonsContainer);

  let startBtn = document.createElement("div");
  startBtn.id = "menu_startBtn";
  startBtn.innerText = translation[language].menu.start;
  startBtn.addEventListener("click", showEnterPlayerField)
  buttonsContainer.appendChild(startBtn);

  let langBtn = document.createElement("div");
  langBtn.id = "menu_langBtn";
  langBtn.innerText = translation[language].menu.language;
  langBtn.addEventListener("click", () => toggleLanguage())
  buttonsContainer.appendChild(langBtn);
  
  let creditsBtn = document.createElement("div");
  creditsBtn.id = "menu_creditsBtn";
  creditsBtn.innerText = translation[language].menu.credits;
  creditsBtn.addEventListener("click", () => drawCredits());
  buttonsContainer.appendChild(creditsBtn);

  let anchor = document.createElement("a");
  anchor.href = "https://github.com/LofQ123";
  anchor.target = "_blank";
  let footer = document.createElement("div");
  footer.id = "menu_footer";
  footer.innerText = "Ruslan Alexeev";
  footer.appendChild(readyImg(ui.gitLogo, "gitLogo"));
  anchor.appendChild(footer);

  buttonsContainer.appendChild(anchor);
}

function drawCredits() {
  let menuContainer = document.getElementById("container_menu");
  let buttonsContainer = document.getElementById("container_menuBtns");
  buttonsContainer.classList.add("moved")

  setTimeout(() => {
    menuContainer.removeChild(buttonsContainer)
    let creditsContainer = document.createElement("div");
    creditsContainer.id = "container_credits";

    let credit1 = document.createElement('div');
    credit1.classList.add("credit_p");
    credit1.innerText = translation[language].menu.credits1;

    let credit2 = document.createElement('div');
    credit2.classList.add("credit_p");
    credit2.innerText = translation[language].menu.credits2;

    let credit3 = document.createElement('div');
    credit3.classList.add("credit_p");
    credit3.innerText = translation[language].menu.credits3;

    let backBtn = document.createElement('div');
    backBtn.id = "creditsBackBtn";
    backBtn.innerText = translation[language].menu.backBtn;
    backBtn.addEventListener("click", () => backToMainMenu())

    creditsContainer.appendChild(credit1)
    creditsContainer.appendChild(credit2)
    creditsContainer.appendChild(credit3)
    creditsContainer.appendChild(backBtn)

    menuContainer.appendChild(creditsContainer)
  }, 1000);
}

function backToMainMenu() {
  let creditsContainer = document.getElementById("container_credits");
  let mainContainer = document.getElementById("container_menu");
  
  creditsContainer.classList.add("moved");
  setTimeout(() => {
    mainContainer.removeChild(creditsContainer);

    let buttonsContainer = document.createElement("div");
    buttonsContainer.id = "container_menuBtns";
    mainContainer.appendChild(buttonsContainer);

    let startBtn = document.createElement("div");
    startBtn.id = "menu_startBtn";
    startBtn.innerText = translation[language].menu.start;
    startBtn.addEventListener("click", showEnterPlayerField)
    buttonsContainer.appendChild(startBtn);

    let langBtn = document.createElement("div");
    langBtn.id = "menu_langBtn";
    langBtn.innerText = translation[language].menu.language;
    langBtn.addEventListener("click", () => toggleLanguage())
    buttonsContainer.appendChild(langBtn);
    
    let creditsBtn = document.createElement("div");
    creditsBtn.id = "menu_creditsBtn";
    creditsBtn.innerText = translation[language].menu.credits;
    creditsBtn.addEventListener("click", () => drawCredits());
    buttonsContainer.appendChild(creditsBtn);

    let anchor = document.createElement("a");
    anchor.href = "https://github.com/LofQ123";
    anchor.target = "_blank";
    let footer = document.createElement("div");
    footer.id = "menu_footer";
    footer.innerText = "Ruslan Alexeev";
    footer.appendChild(readyImg(ui.gitLogo, "gitLogo"));
    anchor.appendChild(footer);

    buttonsContainer.appendChild(anchor);
  }, 1000)
}

function toggleLanguage() {
  let mainContainer = document.getElementById("container_center");
  let menuContainer = document.getElementById("container_menu");

  language === "eng"
    ? language = "rus"
    : language = "eng";

    mainContainer.removeChild(menuContainer);
  draw_startScreen();
}

function showEnterPlayerField() {
  let menuContainer = document.getElementById("container_menu");
  let buttonsContainer = document.getElementById("container_menuBtns");
  buttonsContainer.classList.add("moved")

  
  setTimeout(() => {
    menuContainer.removeChild(buttonsContainer)
    let nameField = document.createElement("input");
    nameField.type = "text";
    nameField.placeholder = translation[language].menu.namePlaceholder;
    nameField.id = "menu_input";
    menuContainer.appendChild(nameField)

    let inputLabel = document.createElement("div");
    inputLabel.id = "menu_inputLabel";
    inputLabel.innerText = translation[language].menu.enterName;
    menuContainer.appendChild(inputLabel);

    let nameBtn = document.createElement("button");
    nameBtn.id = "menu_inputBtn";
    nameBtn.innerText = translation[language].menu.goBtn;
    nameBtn.addEventListener("click", () => startGame(nameField.value))
    menuContainer.appendChild(nameBtn)
  }, 1000);
}

function startGame(input) {
  let menuContainer = document.getElementById("container_menu");

  let playerName;
  if (input === "") playerName = translation[language].menu.namePlaceholder;
  else playerName = input;

  setPlayer1(playerName);
  menuContainer.classList.add("hidden");
  setTimeout(() => {
    document.getElementById("container_center").removeChild(menuContainer);
    player2 = new Player (translation[language].menu.aiName, "ai");
    draw_gameScreen();
    placing_start();
  }, 1100)
  
}

function setPlayer1(name) {
  player1 = new Player(name, "human");
}

export function draw_gameScreen() {
  drawElements_gameScreen();
  drawPlayersInfo();
  drawPlacingButtons();
  drawGrid("left");
  drawGrid("right");

  drawDisplays();
}

function drawDisplays() {
  const log = document.getElementById("container_log");
  const leftInfo = document.getElementById("leftPlayerInfo");
  const stateDisplay = document.getElementById("stateDisplay");
  const rightInfo = document.getElementById("rightPlayerInfo");
  const leftDisplay = document.getElementById("container_cellsLeft");
  const rightDisplay = document.getElementById("container_cellsRight");

  log.style.display = "block";
  leftInfo.style.display = "flex";
  stateDisplay.style.display = "flex";
  rightInfo.style.display = "flex";
  leftDisplay.style.display = "grid";
  rightDisplay.style.display = "grid";

  animateGrid("left");
  animateGrid("right"); 

  drawAbilities("left")
  drawAbilities("right")
}

function drawPlacingButtons() {
  const container = document.getElementById("container_centerBottom");

  const btnContainer = document.createElement("div");
  btnContainer.id = "placingBtnContainer";

  let goBtn = document.createElement("div");
  goBtn.id = "placingGoBtn";
  goBtn.innerText = translation[language].menu.startBtn;
  goBtn.addEventListener("click", async () => {
    generateFleet(player2);
    await placing_finish();
    battle_start();
    container.removeChild(btnContainer);
  })

  let randomBtn = document.createElement("div");
  randomBtn.id = "placingRandomBtn";
  randomBtn.innerText = translation[language].menu.randomBtn;
  randomBtn.addEventListener("click", async () => {
    generateFleet(player1);
    generateFleet(player2);
    await placing_finish();
    battle_start();
    container.removeChild(btnContainer);
  })
 

  btnContainer.appendChild(goBtn)
  btnContainer.appendChild(randomBtn)
  container.appendChild(btnContainer);
}

export function drawStateDisplay_battle() {
  const stateDisplay = document.getElementById("stateDisplay");

  let imgLeft = document.createElement("img");
  imgLeft.src = ships.icons.whiteF;
  imgLeft.id = "turnIconLeft"
  let imgRight = document.createElement("img");
  imgRight.src = ships.icons.redS;
  imgRight.id = "turnIconRight"

  stateDisplay.appendChild(imgLeft);
  stateDisplay.appendChild(imgRight)
}

export function refreshStateDisplay(player) {
  const imgLeft = document.getElementById("turnIconLeft");
  const imgRight = document.getElementById("turnIconRight")

  if (player === player1) {
    imgLeft.src = ships.icons.whiteF;
    imgRight.src = ships.icons.redS;
  } else {
    imgLeft.src = ships.icons.whiteS;
    imgRight.src = ships.icons.redF;
  }
}

function drawElements_mainFrame() {
  containers.background.appendChild(readyImg(ui.background, "backgroundMain"));
  containers.head.top.appendChild(readyImg(ui.head.top, "headTop"));
  containers.head.bottom.appendChild(readyImg(ui.head.bottom, "headBottom"));
  containers.main.frameLeft.appendChild(readyImg(ui.frame.left, "frameLeft"));
  containers.main.frameRight.appendChild(readyImg(ui.frame.right, "frameRight"));
  containers.main.sidebarLeft.appendChild(readyImg(ui.main.sidebarLeft, "sidebarLeft"));
  containers.main.sidebarRight.appendChild(readyImg(ui.main.sidebarRight, "sidebarRight"));
}

function drawElements_gameScreen() {
  containers.main.center.middle.appendChild(readyImg(ui.main.center.middleBar, "middleBar"));
  containers.main.center.middle.appendChild(readyImg(ui.main.center.displayLeft, "displayLeft"));
  containers.main.center.middle.appendChild(readyImg(ui.main.center.displayRight, "displayRight"));
  containers.main.center.gameboard.self.appendChild(readyImg(ui.main.gameboard, "gameboard"));
  containers.main.center.gameboard.self.appendChild(readyImg(ui.main.center.buttonGray, "buttonAllies"));
  containers.main.center.gameboard.self.appendChild(readyImg(ui.main.center.buttonYellow, "buttonEnemies"));

  document.getElementById("buttonEnemies").addEventListener("click", toggleDisplay);
  document.getElementById("buttonAllies").addEventListener("click", toggleDisplay);
}

function drawPlayersInfo() {
  drawAvatars();
  drawPlayersInfoDisplay(player1);
  drawPlayersInfoDisplay(player2);
}

function drawPlayersInfoDisplay(player) {
  let playerDisplay;
  let name = document.createElement("div");
  let counter = document.createElement("div");
  let points = document.createElement("div");

  if (player === player1) {
    playerDisplay = document.getElementById("leftPlayerInfo");
    name.id = "playerName_left";
    counter.id = "playerCounter_left"
    points.id = "playerPoints_left";
  } else {
    playerDisplay = document.getElementById("rightPlayerInfo");
    name.id = "playerName_right";
    counter.id = "playerCounter_right"
    points.id = "playerPoints_right";
  }
  name.innerText = player.name;
  counter.innerText = "000/100"
  points.innerText = "AP:0"

  playerDisplay.appendChild(name);
  playerDisplay.appendChild(counter);
  playerDisplay.appendChild(points);
}

export function refreshPlayerCounter(player) {
  let counter;

  player === player1
    ? counter = document.getElementById("playerCounter_right")
    : counter = document.getElementById("playerCounter_left");

  counter.innerText = `${player.gameboard.counter.toString().padStart(3, "0")}/100`
}

export function refreshPlayerPointsDisplay(player) {
  let pointsDisplay;

  player === player1
    ? pointsDisplay = document.getElementById("playerPoints_left")
    : pointsDisplay = document.getElementById("playerPoints_right");

  pointsDisplay.innerText = `AP:${player.gameboard.abilities.abilityPoints}`
}

function drawAvatars() {
  const leftAvatar = document.getElementById("leftAvatar");
  const rightAvatar = document.getElementById("rightAvatar");

  leftAvatar.appendChild(readyImg(avatars.cat, "leftAvatar_img", ["avatar"]))
  rightAvatar.appendChild(readyImg(avatars.dog, "rightAvatar_img", ["avatar"]))
};

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

export function drawWinnerWindow(player) {
  // Left Pop Up
  let winnerPopUpLeft = document.createElement("div");
  winnerPopUpLeft.id = "winnerPopUpLeft";

  let msg = document.createElement("div");
  msg.id = "winnerPopUpMessage";
  msg.innerText = `${translation[language].menu.admiral} ${player.name} ${translation[language].menu.hasWon}`
  winnerPopUpLeft.appendChild(msg)

  let btn = document.createElement("div");
  btn.id = "winnerPopUpBtn";
  btn.innerText = `>_${translation[language].menu.playAgain}?`;
  btn.addEventListener("click", () => startAgain())
  winnerPopUpLeft.appendChild(btn)

  const containerLeft = document.getElementById("container_cellsLeft");
  const containerRight = document.getElementById("container_cellsRight");
  
  containerLeft.appendChild(winnerPopUpLeft)
  
  
  //Right Pop Up
  let winnerPopUpRight = document.createElement("div");
  winnerPopUpRight.id = "winnerPopUpRight";
  let playerIMG;
  player === player1
    ? playerIMG = avatars.cat
    : playerIMG = avatars.dog;
  winnerPopUpRight.appendChild(readyImg(playerIMG, "winnerPopUpRightImage"))
  
  containerRight.appendChild(winnerPopUpRight)

}

async function startAgain() {
  document.getElementById("container_cellsLeft").removeChild(document.getElementById("winnerPopUpLeft"));
  document.getElementById("container_cellsRight").removeChild(document.getElementById("winnerPopUpRight"));

  player1 = new Player (player1.name, "human");
  player2 = new Player ("Pawston", "ai");
  battle_removeEventListeners_regularShot();
  await displayPlayerBoard("right");
  await displayPlayerBoard("left");
  drawPlacingButtons();
  placing_start();
}

