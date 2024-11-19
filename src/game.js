import { Player } from "./player";

export class Game {
  constructor(player1_name, player2_name, player2_type, boardSize) {
    this.player1 = new Player(player1_name, boardSize, "human");
    this.player2 = new Player(player2_name, boardSize, player2_type);
    this.currentPlayer = this.player1;
  }
}