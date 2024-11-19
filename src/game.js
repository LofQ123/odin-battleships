import { Player } from "./player";

export class Game {
  constructor(player1_name, player2_name, player2_type) {
    this.player1 = new Player(player1_name, "human");
    this.player2 = new Player(player2_name, player2_type);
    this.currentPlayer = this.player1;
  }

  nextPlayer() {
    if (this.currentPlayer === this.player1) this.currentPlayer = this.player2
    else this.currentPlayer = this.player1
  }

  playerPlacesShip(shipSize, coordinates) {
    this.currentPlayer.gameboard.placeShip(shipSize, coordinates);
  }
}