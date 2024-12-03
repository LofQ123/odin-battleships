import {
  player1,
  player2,
  clearDisplay,
  displayEnemyBoard,
  displayPlayerBoard,
  displayedBoard,
  language
} from "./dom";
import { chooseRandomCell, generateRandomIntegerInRange, chooseOrientation } from "./ai";
import { getEnergy, refreshAbilityState, abilityToPlace, Mine, Torpedo, Bomb } from "./dom_abilities";
import { logMessage } from "./dom_log";
import { translation } from "./translation";

let timeout = false;
let aiSpeed = 2000;

export function battle_start() {
  battle_addEventListeners_regularShot();
  logMessage(translation[language].messages.battleStarts);
  logMessage(translation[language].messages.isPlanning, { player: player1 })
}

export function battle_addEventListeners_regularShot() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.addEventListener("click", player1TakesTurn);
  }
}

export function battle_removeEventListeners_regularShot() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.removeEventListener("click", player1TakesTurn);
  }
}

export async function player1TakesTurn(e, options = { ability: null, cells: null }) {
  if (timeout) return;
  timeout = true;

  if (options.ability === "bomb") {
    await abilityToPlace.ability.dropBomb();
  } else if (options.ability === "torpedo") {
    await abilityToPlace.ability.launchTorpedo();
  } else if (!options.ability) {
    let targetCell = [e.target.id[4], e.target.id[6]];
    logMessage(translation[language].messages.regularShot, { player: player1, cells: targetCell} );
    player1Shoots(targetCell);
    player1.lastMove = targetCell;
    e.target.removeEventListener("click", player1TakesTurn);
    e.target.addEventListener("click", showIllegalCellMessage);
  }

  refreshAbilityState(player2)
  getEnergy(player1);
  refreshAbilityState(player1)

  if (player2.gameboard.isFleetSunk()) {
    gameOver(player1);
    return
  }

  if (player1.gameboard.abilities.extraTurn) {
    logMessage(translation[language].messages.extraTurn);
    logMessage(translation[language].messages.isPlanning, { player: player1 });
    player1.gameboard.abilities.extraTurn = false;
    timeout = false;

  } else {
    logMessage(translation[language].messages.isPlanning, { player: player2 });
    setTimeout(player2TakesTurn, aiSpeed);
  }
}

export async function player2TakesTurn() {
  let move;
  if (player2.gameboard.abilities.abilityPoints > 0) {
    move = decideNextMove();
  } else move = "regularShot";

  if (move === "regularShot") {
    let targetCell = getCellToShoot();
    logMessage(translation[language].messages.regularShot, { player: player2, cells: targetCell });
    await player2Shoots(targetCell);
    player2.lastMove = targetCell;
    refreshAbilityState(player1)
  
    if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship) {
      if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship.type !== "mine") player2.lastHits.push(targetCell);
      if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship.sunk) player2.lastHits = [];
    } 
  } else if (move === "mine") {
    await ai_placeMine();

    let targetCell = getCellToShoot();
    logMessage(translation[language].messages.regularShot, { player: player2, cells: targetCell });
    player2Shoots(targetCell);
    player2.lastMove = targetCell;
    refreshAbilityState(player1)
    
    if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship) {
      if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship.type !== "mine") player2.lastHits.push(targetCell);
      if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship.sunk) player2.lastHits = [];
    } 
  } else if (move === "torpedo") {
    await ai_launchTorpedo();
    refreshAbilityState(player1);
 
  } else if (move === "double") {
    console.log("Player2 uses double shot")
    ai_doubleShot();

    let targetCell = getCellToShoot();
    logMessage(translation[language].messages.regularShot, {player: player2, cells: targetCell})

    player2Shoots(targetCell);
    player2.lastMove = targetCell;
    refreshAbilityState(player1)

    if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship) {
      if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship.type !== "mine") player2.lastHits.push(targetCell);
      if (player1.gameboard.board[targetCell[0]][targetCell[1]].ship.sunk) player2.lastHits = [];
    } 
  } else {
    console.log("Player2 drops bomb")
    await ai_dropBomb();
    refreshAbilityState(player1);
  }
  
  getEnergy(player2);
  refreshAbilityState(player2);

  if(player1.gameboard.isFleetSunk()) {
    gameOver(player2);
    return
  }

  if (player2.gameboard.abilities.extraTurn) {
      logMessage(translation[language].messages.extraTurn)
      player2.gameboard.abilities.extraTurn = false;
      player2TakesTurn();    
  } else {
    timeout = false;
    logMessage(translation[language].messages.isPlanning, {player: player1});
  } 
}

function getCellToShoot(options = {}) {
  let targetCell;
  if (!options.mine && !options.torpedo && !options.bomb) {
    if (player2.lastHits.length === 0) {
      console.log("0 hits")
      targetCell = getTargetCell_noPrevHits();
    } else if (player2.lastHits.length === 1) {
      console.log("1-2 hits")
      targetCell = getTargetCell_singlePrevHit();
    } else if (player2.lastHits.length > 1) {
      console.log("2+ hits")
      targetCell = getTargetCell_multiplePrevHits();
    }  
  } else {
    targetCell = getTargetCell_noPrevHits();
  }
  console.log(targetCell)
  return targetCell;
}

function getTargetCell_noPrevHits() {
  let targetCell = chooseRandomCell();
  while (player1.gameboard.board[targetCell[0]][targetCell[1]].isHit) {
    targetCell = chooseRandomCell();
  } 
  
  return targetCell;
}

function getTargetCell_singlePrevHit() {
  let lastHits = player2.lastHits[0];
  let neighbors = getNeighbors(lastHits);
  let randomIndex = generateRandomIntegerInRange(0, neighbors.length - 1);

  return neighbors[randomIndex]
}

function getTargetCell_multiplePrevHits() {
  //Get line up direction
  let board = player1.gameboard.board;
  let direction;
  let firstHit = player2.lastHits[0];
  let secondHit = player2.lastHits[1];
  firstHit[0] === secondHit[0]
    ? direction = "horizontal"
    : direction = "vertical";

  let possibleShots = [];
  // Getting possible shots;
  if(direction === "vertical") {
    //Get nearest possible shot in one direction
    let y = firstHit[0];
    while(board[y][firstHit[1]].isHit) {
      if (y + 1 > 9 || board[y + 1][firstHit[1]].isHit && !board[y + 1][firstHit[1]].ship) break
      y++;
    }
    if (!board[y][firstHit[1]].isHit) possibleShots.push([y, firstHit[1]]);
    
    //Get nearest possible shot in other direction
    y = firstHit[0];
    while(board[y][firstHit[1]].isHit) {
      if (y - 1 < 0 || board[y - 1][firstHit[1]].isHit && !board[y - 1][firstHit[1]].ship) break
      y--;
    }
    if (!board[y][firstHit[1]].isHit) possibleShots.push([y, firstHit[1]]);
  } else if (direction === "horizontal") {
    //Get nearest possible shot in one direction
    let x = firstHit[1];
    while(board[firstHit[0]][x].isHit) {
      if (x + 1 > 9 || board[firstHit[0]][x + 1].isHit && !board[firstHit[0]][x + 1].ship) break
      x++;
    }
    if (!board[firstHit[0]][x].isHit) possibleShots.push([firstHit[0], x]);

    //Get nearest possible shot in other direction
    x = firstHit[1];
    while(board[firstHit[0]][x].isHit) {
      if (x - 1 < 0 || board[firstHit[0]][x - 1].isHit && !board[firstHit[0]][x - 1].ship) break
      x--;
    }
    if (!board[firstHit[0]][x].isHit) possibleShots.push([firstHit[0], x]);
  }
  
  let randomIndex = generateRandomIntegerInRange(0, possibleShots.length - 1);
  return possibleShots[randomIndex]
}

function getNeighbors(cell) {
  let neighbors = [];

  if (cell[0] - 1 >= 0 && !player1.gameboard.board[cell[0] - 1][cell[1]].isHit)
    neighbors.push([cell[0] - 1, cell[1]]);
  if (cell[0] + 1 <= 9 && !player1.gameboard.board[cell[0] + 1][cell[1]].isHit) 
    neighbors.push([cell[0] + 1, cell[1]]);
  if (cell[1] - 1 >= 0 && !player1.gameboard.board[cell[0]][cell[1] - 1].isHit) 
    neighbors.push([cell[0], cell[1] - 1]);
  if (cell[1] + 1 <= 9 && !player1.gameboard.board[cell[0]][cell[1] + 1].isHit) 
    neighbors.push([cell[0], cell[1] + 1]);

  return neighbors;
}

export async function player1Shoots(coordinates) {
  if (!player2.gameboard.board[coordinates[0]][coordinates[1]].ship) logMessage(translation[language].messages.miss)
  if (player2.gameboard.board[coordinates[0]][coordinates[1]].ship) {
    if (player2.gameboard.board[coordinates[0]][coordinates[1]].ship.type !== "mine") logMessage(translation[language].messages.shipHit)
  }
  player2.gameboard.receiveAttack(coordinates);
  if (player2.gameboard.checkIfMine(coordinates)) await mineBlowsUp(player2);
  await clearDisplay();
  await displayEnemyBoard();
  await displayPlayerBoard("right");
}

export async function player2Shoots(coordinates) {
  if (!player1.gameboard.board[coordinates[0]][coordinates[1]].ship) logMessage(translation[language].messages.miss)
  if (player1.gameboard.board[coordinates[0]][coordinates[1]].ship) {
    if (player1.gameboard.board[coordinates[0]][coordinates[1]].ship.type !== "mine") logMessage(translation[language].messages.shipHit)
  }

  player1.gameboard.receiveAttack(coordinates);
  if (player1.gameboard.checkIfMine(coordinates)) await mineBlowsUp(player1);
  await clearDisplay("right");
  await displayPlayerBoard("right");

  if (displayedBoard === player1) {
    await clearDisplay("left");
    await displayPlayerBoard("left");
  }
}

function showIllegalCellMessage() {
  console.log("We already shot here!");
}

function gameOver(player) {
  logMessage(translation[language].messages.gameOver);
  logMessage(translation[language].messages.playerHasWon, {player: player})
  console.log (`Game Over, ${player} has won!`);
}

async function mineBlowsUp(player) {
  console.log("player blows up a mine!")
  
  if (player === player1) {
    logMessage(translation[language].messages.hitMine, {player: player2})
    for(let i = 0; i < 4; i++) {
      let targetCell = getCellToShoot({mine: true});
      logMessage(translation[language].messages.minePiece, {cells: targetCell})
      await player1Shoots(targetCell);
    }
  } else {
    logMessage(translation[language].messages.hitMine, {player: player1})
    for(let i = 0; i < 4; i++) {
      let targetCell = getCellToShoot({mine: true});
      logMessage(translation[language].messages.minePiece, {cells: targetCell})
      await player2Shoots(targetCell);    
    }
  }
}

function decideNextMove() {
  let roll = generateRandomIntegerInRange(1, 10);
  let abilities = ai_getAvailableAbilities();

  if (roll <= 4 || abilities.length === 0 || player2.lastHits.length > 0) {
    return "regularShot"
  }
  else {
    let randomIndex = generateRandomIntegerInRange(0, abilities.length - 1);
    return abilities[randomIndex]
  }
}

function ai_getAvailableAbilities() {
  let abilities = player2.gameboard.abilities;
  let availableAbilities = [];
  if (abilities.allowMine) availableAbilities.push("mine");
  if (abilities.allowTorpedo) availableAbilities.push("torpedo");
  if (abilities.allowDouble) availableAbilities.push("double");
  if (abilities.allowBomb) availableAbilities.push("bomb");
  return availableAbilities;
}

async function ai_placeMine() {
  player2.gameboard.abilities.abilityPoints--;
  refreshAbilityState(player2);
  
  let targetCell = chooseRandomCell();
  let mine = new Mine(targetCell);
  
  while(!player2.gameboard.isValidShipPlacement(mine.cells, {mine: true,})) {
    targetCell = chooseRandomCell();
    mine = new Mine(targetCell);
  }

  logMessage(translation[language].messages.useMine, {player: player2, cells: mine.cells})
  player2.gameboard.placeShip("1", mine.cells, { mine: mine });
  logMessage(translation[language].messages.isPlanning, {player: player2})
}

async function ai_launchTorpedo() {
  player2.gameboard.abilities.abilityPoints--;
  refreshAbilityState(player2);

  let targetCell = getCellToShoot({torpedo: true});
  let torpedo = new Torpedo(targetCell);
  torpedo.anchor = torpedo.getAnchor(targetCell);
  torpedo.cells = torpedo.getCells();
  
  while(getNumberOfNewCells(torpedo.cells) <= 2) {
    targetCell = getCellToShoot({torpedo: true});
    torpedo = new Torpedo(targetCell);
    torpedo.anchor = torpedo.getAnchor(targetCell);
    torpedo.cells = torpedo.getCells();
  }
  
  logMessage(translation[language].messages.useTorpedo, {player: player2, cells: torpedo.cells})
  for(let cell of torpedo.cells) {
    console.log(`torpedo cell: ${cell}`)
    
    await player2Shoots(cell);

    if (player1.gameboard.board[cell[0]][cell[1]].ship) {
      if (player1.gameboard.board[cell[0]][cell[1]].ship.type !== "mine") player2.lastHits.push(cell);
      if (player1.gameboard.board[cell[0]][cell[1]].ship.sunk) player2.lastHits = [];
    }
  }

  function getNumberOfNewCells(cells) {
    let newCells = 4;
    for(let cell of cells) {
      if (player1.gameboard.board[cell[0]][cell[1]].isHit) newCells--
    }
    return newCells
  }
}

async function ai_doubleShot() {
  logMessage(translation[language].messages.useDouble, { player: player2 });
  logMessage(translation[language].messages.isPlanning, { player: player2 });
  
  player2.gameboard.abilities.abilityPoints--;
  refreshAbilityState(player2);

  player2.gameboard.abilities.extraTurn = true;
}

async function ai_dropBomb() {
  player2.gameboard.abilities.abilityPoints--;
  refreshAbilityState(player2);

  let targetCell = getCellToShoot({bomb: true});
  let orientation = chooseOrientation();
  let bomb = new Bomb(targetCell, orientation);
  
  while(getNumberOfNewCells(bomb.cells) <= 2) {
    targetCell = getCellToShoot({bomb: true});
    orientation = chooseOrientation();
    bomb = new Bomb(targetCell, orientation);
  }

  logMessage(translation[language].messages.useBomb, {player: player2, cells: bomb.cells})

  for(let cell of bomb.cells) {   
    await player2Shoots(cell);

    if (player1.gameboard.board[cell[0]][cell[1]].ship) {
      if (player1.gameboard.board[cell[0]][cell[1]].ship.type !== "mine") player2.lastHits.push(cell);
      if (player1.gameboard.board[cell[0]][cell[1]].ship.sunk) player2.lastHits = [];
    }
  }

  function getNumberOfNewCells(cells) {
    let newCells = 4;
    for(let cell of cells) {
      if (player1.gameboard.board[cell[0]][cell[1]].isHit) newCells--
    }
    return newCells
  }
}

