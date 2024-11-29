export class Ship {
  constructor(type) {
    this.length = parseInt(type[0]);
    this.timesHit = 0;
    this.sunk = false;
    this.code = type;
    this.cells = null;

    if (type === "2") this.type = "boat";
    if (type === "3a") this.type = "cruiser";
    if (type === "3b") this.type = "submarine";
    if (type === "4") this.type = "battleship";
    if (type === "5") this.type = "carrier";
  }

  hit() {
    this.timesHit++
    this.isSunk()
  }

  isSunk() {
    if (this.timesHit === this.length) this.sunk = true;
  }
}