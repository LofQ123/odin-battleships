import { Gameboard } from "./Gameboard";

export class Player {
  constructor(name, boardSize, playerType) {
    this.name = name;
    this.gameboard = new Gameboard(boardSize);
    this.playerType = playerType;
  }
}