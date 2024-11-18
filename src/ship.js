export class Ship {
  constructor(length) {
    this.length = length;
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