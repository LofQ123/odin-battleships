import { Ship } from "./ship";

export class Gameboard {
  constructor(size) {
    this.board = [];
    for (let y = 0; y < size; y++) {
      let row = [];
      for (let x = 0; x < size; x++) {
        row.push(null);
      }
      this.board.push(row)
    }
    this.fleet = [];
  }

  placeShip(shipSize, coordinates) {
    let ship = new Ship(shipSize)
    coordinates.forEach(coord => {
      this.board[coord[0]][coord[1]] = ship;
    });
    this.fleet.push(ship)
  }

  receiveAttack(coordinates) {
    const target = this.board[coordinates[0]][coordinates[1]];
    if (target === null) this.board[coordinates[0]][coordinates[1]] = 0;
    else this.board[coordinates[0]][coordinates[1]].hit();
  }

  isFleetSunk() {
    if(!this.fleet.length) return null
    let fleetSunk = true;
    this.fleet.forEach(ship => {
      if (!ship.sunk) fleetSunk = false;
    })
    return fleetSunk;
  }
}