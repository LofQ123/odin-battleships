import { Ship } from "./ship";

export class Gameboard {
  constructor(size) {
    this.board = [];
    for (let y = 0; y < size; y++) {
      let row = [];
      for (let x = 0; x < size; x++) {
        row.push(null);
      }
      this.board.push(row);
    }
    this.fleet = [];
  }

  placeShip(shipSize, coordinates) {
    if(!this.isValidShipPlacement(coordinates)) return
    let ship = new Ship(shipSize);
    coordinates.forEach((coord) => {
      this.board[coord[0]][coord[1]] = ship;
    });
    this.fleet.push(ship);
  }

  receiveAttack(coordinates) {
    const target = this.board[coordinates[0]][coordinates[1]];
    if (target === null) this.board[coordinates[0]][coordinates[1]] = 0;
    else this.board[coordinates[0]][coordinates[1]].hit();
  }

  isFleetSunk() {
    if (!this.fleet.length) return null;
    let fleetSunk = true;
    this.fleet.forEach((ship) => {
      if (!ship.sunk) fleetSunk = false;
    });
    return fleetSunk;
  }

  _determineTargetCellPosition(coordinates) {
    const target = coordinates;
    const start = 0;
    const end = this.board.length - 1;

    if (target[0] === start) {
      if (target[1] === start) return "bottom-left";
      else if (target[1] > start && target[1] < end) return "bottom";
      else return "bottom-right";
    } else if (target[0] > start && target[0] < end) {
      if (target[1] === start) return "left";
      else if (target[1] > start && target[1] < end) return "middle";
      else return "right";
    } else {
      if (target[1] === start) return "top-left";
      else if (target[1] > start && target[1] < end) return "top";
      else return "top-right";
    }
  }

  _getCellsAroundTarget(coordinates) {
    const target = coordinates;
    const targetY = target[0];
    const targetX = target[1];
    const targetPosition = this._determineTargetCellPosition(target);
    const cellsAround = [];

    if (targetPosition === "top-left") {
      cellsAround.push(
        [targetY - 1, targetX],
        [targetY - 1, targetX + 1],
        [targetY, targetX + 1],
      );
    } else if (targetPosition === "top") {
      cellsAround.push(
        [targetY, targetX - 1],
        [targetY - 1, targetX - 1],
        [targetY - 1, targetX],
        [targetY - 1, targetX + 1],
        [targetY, targetX + 1],
      );
    } else if (targetPosition === "top-right") {
      cellsAround.push(
        [targetY, targetX - 1],
        [targetY - 1, targetX - 1],
        [targetY - 1, targetX],
      );
    } else if (targetPosition === "left") {
      cellsAround.push(
        [targetY - 1, targetX],
        [targetY - 1, targetX + 1],
        [targetY, targetX + 1],
        [targetY + 1, targetX + 1],
        [targetY + 1, targetX],
      );
    } else if (targetPosition === "middle") {
      cellsAround.push(
        [targetY - 1, targetX],
        [targetY - 1, targetX + 1],
        [targetY, targetX + 1],
        [targetY + 1, targetX + 1],
        [targetY + 1, targetX],
        [targetY + 1, targetX - 1],
        [targetY, targetX - 1],
        [targetY - 1, targetX - 1],
      );
    } else if (targetPosition === "right") {
      cellsAround.push(
        [targetY + 1, targetX],
        [targetY + 1, targetX - 1],
        [targetY, targetX - 1],
        [targetY - 1, targetX - 1],
        [targetY - 1, targetX]
      )
    } else if (targetPosition === "bottom-left") {
      cellsAround.push(
        [targetY, targetX + 1],
        [targetY + 1, targetX +1],
        [targetY + 1, targetX]
      )
    } else if (targetPosition === "bottom") {
      cellsAround.push(
        [targetY, targetX + 1],
        [targetY + 1, targetX +1],
        [targetY + 1, targetX],
        [targetY + 1, targetX - 1],
        [targetY, targetX - 1]
      )
    } else {
      cellsAround.push(
        [targetY + 1, targetX],
        [targetY + 1, targetX - 1],
        [targetY, targetX - 1]
      )
    }
    
    return cellsAround
  }

  isValidShipPlacement(coordinates) {
    let isValidPlacement = true;
    coordinates.forEach(set => {
      let cellsAround = this._getCellsAroundTarget(set);
      cellsAround.forEach(cell => {
        if (this.board[cell[0]][cell[1]] !== null) {
          isValidPlacement = false;
        }
      })
    })
    return isValidPlacement;
  }
}
