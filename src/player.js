import { Gameboard } from "./gameboard";

export class Player {
  constructor(name, playerType) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.playerType = playerType;
    this.lastMove = null;
    this.lastHits = [];
  }
}