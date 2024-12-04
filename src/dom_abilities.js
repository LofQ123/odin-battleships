import { readyImg, placeSVG, player1, language, displayPlayerBoard, drawShip, refreshPlayerPointsDisplay } from "./dom";
import { ui, ships } from "./images";
import { player1Shoots, battle_removeEventListeners_regularShot, battle_addEventListeners_regularShot, player1TakesTurn } from "./dom_battle";
import { translation } from "./translation";
import { logMessage } from "./dom_log";


export let abilityToPlace = {
  ability: null,
  orientation: "horizontal",
}

const abilityContainers = {
  left: {
    mine: {
      self: document.getElementById("left_ability_mine"),
      top: document.getElementById("left_ability_mine_top"),
      bottom: document.getElementById("left_ability_mine_bottom")
    },

    torpedo: {
      self: document.getElementById("left_ability_torpedo"),
      top: document.getElementById("left_ability_torpedo_top"),
      bottom: document.getElementById("left_ability_torpedo_bottom")
    },

    double: {
      self: document.getElementById("left_ability_double"),
      top: document.getElementById("left_ability_double_top"),
      bottom: document.getElementById("left_ability_double_bottom")
    },

    bomb: {
      self: document.getElementById("left_ability_bomb"),
      top: document.getElementById("left_ability_bomb_top"),
      bottom: document.getElementById("left_ability_bomb_bottom")
    }
  },

  right: {
    mine: {
      self: document.getElementById("right_ability_mine"),
      top: document.getElementById("right_ability_mine_top"),
      bottom: document.getElementById("right_ability_mine_bottom")
    },

    torpedo: {
      self: document.getElementById("right_ability_torpedo"),
      top: document.getElementById("right_ability_torpedo_top"),
      bottom: document.getElementById("right_ability_torpedo_bottom")
    },

    double: {
      self: document.getElementById("right_ability_double"),
      top: document.getElementById("right_ability_double_top"),
      bottom: document.getElementById("right_ability_double_bottom")
    },

    bomb: {
      self: document.getElementById("right_ability_bomb"),
      top: document.getElementById("right_ability_bomb_top"),
      bottom: document.getElementById("right_ability_bomb_bottom")
    }
  }
}

export function getEnergy(player) {
  player.gameboard.abilities.counter ++;
  if (player.gameboard.abilities.counter === 10) {
    player.gameboard.abilities.counter = 0;
    player.gameboard.abilities.abilityPoints ++
  }
}

export function refreshAbilityState(player) {
  refreshPlayerPointsDisplay(player)
  if (player.gameboard.abilities.abilityPoints > 0) activateAbilities(player)
  else deactivateAbilities(player);
}

function showAbilityContainers() {
  let containers = Array.from(document.querySelectorAll(".ability"));
  containers.forEach(container => container.style.display = "block")
}

export function drawAbilities(side) {
  showAbilityContainers();

  abilityContainers[`${side}`].mine.top.appendChild(readyImg(ui.icons.mine_gray, `${side}_mine_icon`, ["abilityIcon"]))
  abilityContainers[`${side}`].mine.top.appendChild(createLabel(translation[language].abilityName.mine))
  placeSVG(abilityContainers[`${side}`].mine.bottom, ships.cruiser,{id: `${side}_mine_ship`, classes: ["abilityShip"]} );

  abilityContainers[`${side}`].torpedo.top.appendChild(readyImg(ui.icons.torpedo_gray, `${side}_torpedo_icon`, ["abilityIcon"]))
  abilityContainers[`${side}`].torpedo.top.appendChild(createLabel(translation[language].abilityName.torpedo))
  placeSVG(abilityContainers[`${side}`].torpedo.bottom, ships.submarine,{id: `${side}_torpedo_ship`, classes: ["abilityShip"]} );

  abilityContainers[`${side}`].double.top.appendChild(readyImg(ui.icons.double_gray, `${side}_double_icon`, ["abilityIcon"]))
  abilityContainers[`${side}`].double.top.appendChild(createLabel(translation[language].abilityName.double))
  placeSVG(abilityContainers[`${side}`].double.bottom, ships.battleship,{id: `${side}_double_ship`, classes: ["abilityShip"]} );

  abilityContainers[`${side}`].bomb.top.appendChild(readyImg(ui.icons.bomb_gray, `${side}_bomb_icon`, ["abilityIcon"]))
  abilityContainers[`${side}`].bomb.top.appendChild(createLabel(translation[language].abilityName.bomb))
  placeSVG(abilityContainers[`${side}`].bomb.bottom, ships.carrier,{id: `${side}_bomb_ship`, classes: ["abilityShip"]} );

  abilities_addEventListeners_drawAbilityPopUp(side);
}

function abilities_addEventListeners_drawAbilityPopUp(side) {
  if (side === "right") return
  document.getElementById("left_mine_icon").addEventListener("mousemove", drawAbilityPopUp);
  document.getElementById("left_torpedo_icon").addEventListener("mousemove", drawAbilityPopUp);
  document.getElementById("left_double_icon").addEventListener("mousemove", drawAbilityPopUp);
  document.getElementById("left_bomb_icon").addEventListener("mousemove", drawAbilityPopUp);

  document.getElementById("left_mine_icon").addEventListener("mouseout", removeAbilityPopUp);
  document.getElementById("left_torpedo_icon").addEventListener("mouseout", removeAbilityPopUp);
  document.getElementById("left_double_icon").addEventListener("mouseout", removeAbilityPopUp);
  document.getElementById("left_bomb_icon").addEventListener("mouseout", removeAbilityPopUp);
}

function createLabel(txt) {
  let el = document.createElement("div");
  el.classList.add("abilityLabel");
  el.innerText = txt;
  return el
}

function toggleAbilityState(side, type, state) {
  let el = abilityContainers[side][type].self;
  let img = document.getElementById(`${side}_${type}_icon`);
  if (state === "on") {
    if (!Array.from(el.classList).includes("green")) el.classList.add("green")

    img.src = ui.icons[type];
    if (side === "left") {
      if (type === "mine") img.addEventListener("click", selectMine);
      else if (type === "torpedo") img.addEventListener("click", selectTorpedo);
      else if (type === "double") img.addEventListener("click", selectDouble);
      else if (type === "bomb") img.addEventListener("click", selectBomb);
    }
  } else if (state === "off") {
    if (Array.from(el.classList).includes("green")) el.classList.remove("green")

    img.src = ui.icons[`${type}_gray`];
    
    if (side === "left") {
      if (type === "mine") img.removeEventListener("click", selectMine);
      else if (type === "torpedo") img.removeEventListener("click", selectTorpedo);
      else if (type === "double") img.removeEventListener("click", selectDouble);
      else if (type === "bomb") img.removeEventListener("click", selectBomb);
    }
  }
}

function drawAbilityPopUp(e) {
  let ability;
  if (e.target.id === "left_mine_icon" || e.target.id === "right_mine_icon") {
    ability = "mine";
  } else if (e.target.id === "left_torpedo_icon" || e.target.id === "right_torpedo_icon") {
    ability = "torpedo";
  } else if (e.target.id === "left_double_icon" || e.target.id === "right_double_icon") {
    ability = "double";
  } else if (e.target.id === "left_bomb_icon" || e.target.id === "right_bomb_icon") {
    ability = "bomb"
  }

  if(!document.getElementById(`abilityPopUp_${ability}`)) {
    let popUp = createPopUp(ability);
    e.target.parentElement.appendChild(popUp);
  }
  
  let popUp = document.getElementById(`abilityPopUp_${ability}`);
  popUp.style.left = `calc(${e.clientX}px - 4.5vw)`;
  if (ability === "mine") popUp.style.top = `calc(${e.clientY}px - 9vh)`;
  else if (ability === "torpedo") popUp.style.top = `calc(${e.clientY}px - 25.4vh)`;
  else if (ability === "double") popUp.style.top = `calc(${e.clientY}px - 41.6vh)`;
  else if (ability === "bomb") popUp.style.top = `calc(${e.clientY}px - 57.9vh)`;
}

export function createPopUp(ability) {
  let popUp = document.createElement("div");
    popUp.classList.add("abilityPopUp");
    popUp.id = `abilityPopUp_${ability}`;

    let header = document.createElement("div");
    header.classList.add("abilityPopUp_header");
    header.innerText = translation[language].abilityName[ability];
    
    let description = document.createElement("div");
    description.classList.add("abilityPopUp_description");
    description.innerText = translation[language].abilityPopUp[ability];

    popUp.appendChild(header);
    popUp.appendChild(description);

    return popUp
}

function removeAbilityPopUp(e) {
  let ability;
  if (e.target.id === "left_mine_icon" || e.target.id === "right_mine_icon") {
    ability = "mine";
  } else if (e.target.id === "left_torpedo_icon" || e.target.id === "right_torpedo_icon") {
    ability = "torpedo";
  } else if (e.target.id === "left_double_icon" || e.target.id === "right_double_icon") {
    ability = "double";
  } else if (e.target.id === "left_bomb_icon" || e.target.id === "right_bomb_icon") {
    ability = "bomb"
  }

  if(document.getElementById(`abilityPopUp_${ability}`)) {
    e.target.parentElement.removeChild(document.getElementById(`abilityPopUp_${ability}`))
  }
}

function activateAbilities(player) {
  let side;
  player === player1
    ? side = "left"
    : side = "right"

  deactivateAbilities(player);

  if (player.gameboard.abilities.allowMine) toggleAbilityState(side, "mine", "on");
  if (player.gameboard.abilities.allowTorpedo) toggleAbilityState(side, "torpedo", "on");
  if (player.gameboard.abilities.allowDouble) toggleAbilityState(side, "double", "on");
  if (player.gameboard.abilities.allowBomb) toggleAbilityState(side, "bomb", "on");
}

function deactivateAbilities(player) {
  let side;
  player === player1
    ? side = "left"
    : side = "right"

    toggleAbilityState(side, "mine", "off");
    toggleAbilityState(side, "torpedo", "off");
    toggleAbilityState(side, "double", "off");
    toggleAbilityState(side, "bomb", "off");
}

function abilities_addCancelButton(ability) {
  let parent = abilityContainers.left[ability].top;
  let children = Array.from(parent.childNodes);
  let label;
  for (let child of children) {
    if (Array.from(child.classList).includes("abilityLabel")) label = child
  }
  
  parent.removeChild(label);
  
  let button = document.createElement("div");
  if (ability === "mine") {
    button.id = "abortBtnMine";
    button.addEventListener("click", mine_finishSelection)
  } else if (ability === "torpedo") {
    button.id = "abortBtnTorpedo";
    button.addEventListener("click", torpedo_finishSelection)
  } else if (ability === "bomb") {
    button.id = "abortBtnBomb";
    button.addEventListener("click", bomb_finishSelection)
  } 
  button.classList.add("abilityAbortBtn");
  button.innerText = "ABORT";
  parent.appendChild(button);
}





//Ability bomb stuff

export class Bomb {
  constructor(cell, orientation) {
    this.anchor = this.getAnchor(cell, orientation);
    this.cells = this.getCells(orientation);
  }

  getAnchor(cell, orientation) {
    let anchor;
    if (orientation === "horizontal") {
      cell[1] > 6
        ? anchor = [cell[0], 6]
        : anchor = [cell[0], cell[1]];
    } else if (orientation === "vertical") {
      cell[0] > 6
        ? anchor = [6, cell[1]]
        : anchor = [cell[0], cell[1]];
    }
    return anchor;
  }

  getCells(orientation) {
    let cells = [this.anchor];

    for (let i = 1; i < 4; i++) {
      orientation === "horizontal"
        ? cells.push([this.anchor[0], this.anchor[1] + i])
        : cells.push([this.anchor[0] + i, this.anchor[1]])
    }
    return cells
  }

  clearBoard() {
    let board = document.getElementById("container_cellsLeft");
    let cells = Array.from(board.children);
    for (let cell of cells) {
      cell.classList.remove("area")
    }
  }

  highlightArea() {
    let cells = this.cells;
    for (let cell of cells) {
      document.getElementById(`dL-[${cell[0]},${cell[1]}]`).classList.add("area");
    }
  }

  rotate() {
    if (abilityToPlace.orientation === "horizontal") {
      abilityToPlace.orientation = "vertical";
      document.getElementById(`dL-[${abilityToPlace.ability.anchor[0]},${abilityToPlace.ability.anchor[1]}]`).dispatchEvent(new Event("mouseover"))
    } else if (abilityToPlace.orientation === "vertical") {
      abilityToPlace.orientation = "horizontal";
      document.getElementById(`dL-[${abilityToPlace.ability.anchor[0]},${abilityToPlace.ability.anchor[1]}]`).dispatchEvent(new Event("mouseover"))
    }
  }

  async dropBomb() {
    player1.gameboard.abilities.abilityPoints--;
    refreshAbilityState(player1);

    logMessage(translation[language].messages.useBomb, {player: player1, cells: this.cells});
    for(let cell of this.cells) {
      await player1Shoots(cell);
    }
  }
}

function selectBomb() {
  document.getElementById("left_bomb_icon").removeEventListener("click", selectBomb)
  bomb_initiateSelection();
}

function bomb_initiateSelection() {
  abilities_addCancelButton("bomb");
  battle_removeEventListeners_regularShot();
  abilities_addEventListeners_bomb();
}

function bomb_finishSelection() {
  abilities_removeEventListeners_bomb();
  battle_addEventListeners_regularShot();

  if(abilityToPlace.ability) abilityToPlace.ability.clearBoard();

  abilityToPlace.ability =  {
    ability: null,
    orientation: "horizontal",
  }
  //Delete abort button and restore label and event listener
  document.getElementById("left_ability_bomb_top").removeChild(document.getElementById("abortBtnBomb"))
  abilityContainers.left.bomb.top.appendChild(createLabel(translation[language].abilityName.bomb))
  document.getElementById("left_bomb_icon").addEventListener("click", selectBomb)
}

function abilities_addEventListeners_bomb() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.addEventListener("mouseover", bomb_handleMouseOver);
    cell.addEventListener("click", bomb_handleClick)
  }

  document.body.addEventListener("keypress", bomb_handleKeyPress)
}

function abilities_removeEventListeners_bomb() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.removeEventListener("mouseover", bomb_handleMouseOver);
    cell.removeEventListener("click", bomb_handleClick)
  }

  document.body.removeEventListener("keypress", bomb_handleKeyPress)
}

function bomb_handleMouseOver(e) {
  //Getting target element and it's coordinates
  let targetCellY = parseInt(e.target.id[4]);
  let targetCellX = parseInt(e.target.id[6]);

  abilityToPlace.ability = new Bomb([targetCellY, targetCellX], abilityToPlace.orientation);
  
  
  abilityToPlace.ability.clearBoard();
  abilityToPlace.ability.highlightArea();
}

async function bomb_handleClick() {
  player1TakesTurn(null, { ability: "bomb", cells: abilityToPlace.ability.cells })
  bomb_finishSelection();
}

function bomb_handleKeyPress(e) {
  if (e.key === "r" || e.key === "к") abilityToPlace.ability.rotate();
}





// Torpedo stuff

export class Torpedo {
  constructor(cell) {
    this.anchor = this.getAnchor(cell);
    this.cells = this.getCells();
  }

  getAnchor(cell) {
    let anchorY = cell[0];
    let anchorX = cell[1];

    if (anchorY === 9) anchorY = 8;
    if (anchorX === 9) anchorX = 8;

    return [anchorY, anchorX];
  }

  getCells() {
    let cells = [this.anchor];
    let anchorY = this.anchor[0];
    let anchorX = this.anchor[1];

    cells.push(
      [anchorY, anchorX + 1],
      [anchorY + 1, anchorX],
      [anchorY + 1, anchorX + 1]
    )

    return cells
  }

  clearBoard() {
    let board = document.getElementById("container_cellsLeft");
    let cells = Array.from(board.children);
    for (let cell of cells) {
      cell.classList.remove("area")
    }
  }

  highlightArea() {
    let cells = this.cells;
    for (let cell of cells) {
      document.getElementById(`dL-[${cell[0]},${cell[1]}]`).classList.add("area");
    }
  }

  async launchTorpedo() {
    player1.gameboard.abilities.abilityPoints--;
    refreshAbilityState(player1);

    logMessage(translation[language].messages.useTorpedo, {player: player1, cells: this.cells})
    for(let cell of this.cells) {
      await player1Shoots(cell);
    }
  }
}

function selectTorpedo() {
  document.getElementById("left_torpedo_icon").removeEventListener("click", selectTorpedo)
  torpedo_initiateSelection();
}

function torpedo_initiateSelection() {
  abilities_addCancelButton("torpedo");
  battle_removeEventListeners_regularShot();
  abilities_addEventListeners_torpedo();
}

function abilities_addEventListeners_torpedo() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.addEventListener("mouseover", torpedo_handleMouseOver);
    cell.addEventListener("click", torpedo_handleClick)
  }
}

function abilities_removeEventListeners_torpedo() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.removeEventListener("mouseover", torpedo_handleMouseOver);
    cell.removeEventListener("click", torpedo_handleClick)
  }
}

function torpedo_handleMouseOver(e) {
  //Getting target element and it's coordinates
  let targetCellY = parseInt(e.target.id[4]);
  let targetCellX = parseInt(e.target.id[6]);

  abilityToPlace.ability = new Torpedo([targetCellY, targetCellX]);
    
  abilityToPlace.ability.clearBoard();
  abilityToPlace.ability.highlightArea();
}

async function torpedo_handleClick() {
  player1TakesTurn(null, { ability: "torpedo", cells: abilityToPlace.ability.cells })
  torpedo_finishSelection();
}

function torpedo_finishSelection() {
  abilities_removeEventListeners_torpedo();
  battle_addEventListeners_regularShot();

  if(abilityToPlace.ability) abilityToPlace.ability.clearBoard();

  abilityToPlace.ability =  {
    ability: null,
    orientation: "horizontal",
  }
  //Delete abort button and restore label and event listener
  document.getElementById("left_ability_torpedo_top").removeChild(document.getElementById("abortBtnTorpedo"))
  abilityContainers.left.torpedo.top.appendChild(createLabel(translation[language].abilityName.torpedo))
  document.getElementById("left_torpedo_icon").addEventListener("click", selectTorpedo)
}





// Mine stuff
export class Mine {
  constructor(cell) {
    this.length = 1;
    this.timesHit = 0;
    this.sunk = false;
    this.code = "1";
    this.type = "mine";
    this.cells = cell;
    this.anchor = cell;
  }

  clearBoard() {
    let board = document.getElementById("container_cellsLeft");
    let cells = Array.from(board.children);
    for (let cell of cells) {
      cell.classList.remove("area")
    }
  }

  remove() {
    let shipToPlaceSVG = document.getElementById("mineToPlace");
    if (shipToPlaceSVG) {
      let parent = shipToPlaceSVG.parentElement;
      parent.removeChild(shipToPlaceSVG);
    }
  }

  draw() {
    player1.gameboard.isValidShipPlacement(abilityToPlace.ability.cells, {mine: true})
      ? drawShip(abilityToPlace.ability, "left", { id: "mineToPlace", mine: true, classes: [] })
      : drawShip(abilityToPlace.ability, "left", { id: "mineToPlace", classes: ["red"], mine: true });
  }

  async place() {
    if(!abilityToPlace.ability) return;
    
    if(player1.gameboard.isValidShipPlacement(abilityToPlace.ability.cells, {mine: true,})) {
      player1.gameboard.abilities.abilityPoints--;
      refreshAbilityState(player1);
      
      logMessage(translation[language].messages.useMine, { player: player1, cells: abilityToPlace.ability.cells });
      logMessage(translation[language].messages.isPlanning, { player: player1 });
      player1.gameboard.placeShip("1", abilityToPlace.ability.cells, { mine: abilityToPlace.ability });
      mine_finishSelection();
      await displayPlayerBoard("right")

    } else return;
  }
}

function selectMine() {
  document.getElementById("left_mine_icon").removeEventListener("click", selectMine)
  mine_initiateSelection();
  document.getElementById("buttonAllies").dispatchEvent(new Event("click"));
}

function mine_initiateSelection() {
  abilities_addCancelButton("mine");
  battle_removeEventListeners_regularShot();
  abilities_addEventListeners_mine();
}

function abilities_addEventListeners_mine() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.addEventListener("mouseover", mine_handleMouseOver);
    cell.addEventListener("click", mine_handleClick)
  }
}

function abilities_removeEventListeners_mine() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.removeEventListener("mouseover", mine_handleMouseOver);
    cell.removeEventListener("click", mine_handleClick)
  }
}

function mine_handleMouseOver(e) {
  //Getting target element and it's coordinates
  let targetCellY = parseInt(e.target.id[4]);
  let targetCellX = parseInt(e.target.id[6]);

  abilityToPlace.ability = new Mine([targetCellY, targetCellX]);
  
  abilityToPlace.ability.remove();
  abilityToPlace.ability.draw();
}

async function mine_handleClick() {
  await abilityToPlace.ability.place();
}

function mine_finishSelection() {
  abilities_removeEventListeners_mine();
  battle_addEventListeners_regularShot();

  document.getElementById("buttonEnemies").dispatchEvent(new Event("click"));

  abilityToPlace.ability =  {
    ability: null,
    orientation: "horizontal",
  }
  //Delete abort button and restore label and event listener
  document.getElementById("left_ability_mine_top").removeChild(document.getElementById("abortBtnMine"))
  abilityContainers.left.mine.top.appendChild(createLabel(translation[language].abilityName.mine))
  document.getElementById("left_mine_icon").addEventListener("click", selectMine)
}





// Double stuff

function selectDouble() {
  logMessage(translation[language].messages.useDouble, {player: player1});
  logMessage(translation[language].messages.isPlanning, { player: player1 });
  player1.gameboard.abilities.extraTurn = true;
  player1.gameboard.abilities.abilityPoints--;
  refreshAbilityState(player1);
}
