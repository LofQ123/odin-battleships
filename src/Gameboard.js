export class Gameboard {
  constructor(size) {
    this.board = [];
    for (let x = 0; x < size; x++) {
      let row = [];
      for (let y = 0; y < size; y++) {
        row.push(null);
      }
      this.board.push(row)
    }
  }
}