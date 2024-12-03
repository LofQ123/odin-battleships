import { Ship } from "./ship";
export class Gameboard {
  constructor() {
    this.board = [];
    for (let y = 0; y < 10; y++) {
      let row = [];
      for (let x = 0; x < 10; x++) {
        row.push({ship: null, isHit: false});
      }
      this.board.push(row);
    }
    this.fleet = [];
    this.abilities = {
      counter: 0,
      abilityPoints: 0,
      allowMine: false,
      allowTorpedo: false,
      allowDouble: false,
      allowBomb: false,
      extraTurn: false,
    }
  }

  placeShip(type, coordinates, options = {}) {
    if(!options.mine) {
      let ship = new Ship(type);
      ship.anchor = coordinates[0];
      coordinates[0][0] === coordinates[1][0]
       ? ship.orientation = "horizontal"
       : ship.orientation = "vertical";
      this.fleet.push(ship);

      coordinates.forEach((coord) => {
       this.board[coord[0]][coord[1]].ship = ship;
      });

      ship.cells = coordinates;

      if (type === "3a") this.abilities.allowMine = true;
      else if (type === "3b") this.abilities.allowTorpedo = true;
      else if (type === "4") this.abilities.allowDouble = true;
      else if (type === "5") this.abilities.allowBomb = true;
    } else {
      this.board[coordinates[0]][coordinates[1]].ship = options.mine;
      this.mine = options.mine
    }  
  }

  receiveAttack(coordinates) {
    const target = this.board[coordinates[0]][coordinates[1]];

    if (!target.isHit) {
      target.isHit = true;

      if (target.ship && target.ship.type !== "mine") {
        target.ship.hit();
        if (target.ship.sunk) {
          if (target.ship.code === "3a") this.abilities.allowMine = false;
          else if (target.ship.code === "3b") this.abilities.allowTorpedo = false;
          else if (target.ship.code === "4") this.abilities.allowDouble = false;
          else if (target.ship.code === "5") this.abilities.allowBomb = false;
        } 
      } 
    }
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
    const end = 9;

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

  isValidShipPlacement(coordinates, options = { mine: false }) {
    let isValidPlacement = true;

    if (!options.mine) {
      coordinates.forEach(set => {
        let cellsAround = this._getCellsAroundTarget(set);
        cellsAround.forEach(cell => {
          if (this.board[cell[0]][cell[1]].ship) {
            isValidPlacement = false;
          }
        })
      })
    } else {
      if (this.board[coordinates[0]][coordinates[1]].isHit || this.board[coordinates[0]][coordinates[1]].ship) isValidPlacement = false;
    }
    
  return isValidPlacement;
  }

  checkIfMine(coordinates) {
    const target = this.board[coordinates[0]][coordinates[1]];
    if (target.ship && target.ship.type === "mine" && !target.ship.sunk) return true
    else return false;
  }
} 
