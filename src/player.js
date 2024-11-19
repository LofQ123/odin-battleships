import { Gameboard } from "./gameboard";

export class Player {
  constructor(name, boardSize, playerType) {
    this.name = name;
    this.gameboard = new Gameboard(boardSize);
    this.playerType = playerType;
  }
}