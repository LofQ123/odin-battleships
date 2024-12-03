import { player2, player1 } from "./dom";

export function chooseOrientation() {
  let n = generateRandomIntegerInRange(1, 2);
  let orientation;
  n === 1
    ? orientation = "horizontal"
    : orientation = "vertical";
  return orientation
}

export function chooseRandomCell() {
  let y = generateRandomIntegerInRange(0, 9);
  let x = generateRandomIntegerInRange(0, 9);
  return [y,x]  
}

export function getCells(cell, orientation, length) {
  let shipCells = [];

  for (let i = 0; i < length; i++) {
    if (orientation === "horizontal") {
      if ((cell[1] + i) > 9) {
        shipCells = null;
        break
      }
      shipCells.push([cell[0], cell[1] + i])
    } else {
      if ((cell[0] + i) > 9) {
        shipCells = null;
        break
      }
      shipCells.push([cell[0] + i, cell[1]])
    }
  }
  
  return shipCells
}

export function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePosition(type) {
  let length = parseInt(type[0]);
  let anchor = chooseRandomCell();
  let orientation = chooseOrientation();
  let position = getCells(anchor, orientation, length);
  if (!position) position = generatePosition(type)
  return position;
}

export function placeShipAtGeneratedPosition(type, player = "player2") {
  let position = generatePosition(type);
  let board;

  player === "player2"
    ? board = player2.gameboard
    : board = player1.gameboard;

  if (!board.isValidShipPlacement(position)) {
    placeShipAtGeneratedPosition(type, player);
  } else {
    board.placeShip(type, position);
  }
}

export function generateFleet(player) {
  placeShipAtGeneratedPosition("5", player); 
  placeShipAtGeneratedPosition("4", player);
  placeShipAtGeneratedPosition("3b", player);
  placeShipAtGeneratedPosition("3a", player);
  placeShipAtGeneratedPosition("2", player);
}