export class Ship {
  constructor(shipSize) {
    this.length = shipSize;
    this.timesHit = 0;
    this.sunk = false;
  }

  hit() {
    this.timesHit++
    this.isSunk()
  }

  isSunk() {
    if (this.timesHit === this.length) this.sunk = true;
  }
}