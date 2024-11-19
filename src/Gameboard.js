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
  }

  placeShip(shipSize, coordinates) {
    let ship = new Ship(shipSize)
    coordinates.forEach(coord => {
      this.board[coord[0]][coord[1]] = ship;
    });
  }

  receiveAttack(coordinates) {
    const target = this.board[coordinates[0]][coordinates[1]];
    if (target === null) this.board[coordinates[0]][coordinates[1]] = 0;
    else this.board[coordinates[0]][coordinates[1]].hit();
  }
}