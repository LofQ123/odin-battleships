import { Ship } from "./ship";
import { player1, drawShip, displayPlayerBoard } from "./dom";

let placing_lastMouseOverTime;

export let shipToPlace = {
  ship: {
    length: null,
    code: null,
  },
  lastAnchor: null,

  getNewShip: (type) => {
    shipToPlace.ship = new Ship(type);
    shipToPlace.ship.orientation = "horizontal";
    if (!shipToPlace.lastAnchor) {
      shipToPlace.ship.anchor = [0, 0]
    } else {
      if (10 - shipToPlace.lastAnchor[1] < shipToPlace.ship.length) {
        shipToPlace.ship.anchor = [shipToPlace.lastAnchor[0], 10 - shipToPlace.ship.length];
      } else {
        shipToPlace.ship.anchor = shipToPlace.lastAnchor;
      }
    }
  },

  draw: () => {
    shipToPlace.getCells();
    player1.gameboard.isValidShipPlacement(shipToPlace.ship.cells)
    ? drawShip(shipToPlace.ship, "left", { id: "shipToPlace", })
    : drawShip(shipToPlace.ship, "left", { id: "shipToPlace", classes: ["red"] });
  },

  rotate: async () => {
    if (shipToPlace.ship.orientation === "horizontal") {
      shipToPlace.ship.orientation = "vertical";
      document.getElementById(`dL-[${shipToPlace.ship.anchor[0]},${shipToPlace.ship.anchor[1]}]`).dispatchEvent(new Event("mouseover"))
    } else if (shipToPlace.ship.orientation === "vertical") {
      shipToPlace.ship.orientation = "horizontal";
      document.getElementById(`dL-[${shipToPlace.ship.anchor[0]},${shipToPlace.ship.anchor[1]}]`).dispatchEvent(new Event("mouseover"))
    }
  },

  getCells: () => {
    let ship = shipToPlace.ship;
    let shipCells = [];
    let i = 0;
    let anchorY = ship.anchor[0];
    let anchorX = ship.anchor[1];
  
    while (i < ship.length) {
      if (ship.orientation === "vertical") {
        shipCells.push([anchorY,anchorX]);
        anchorY++;
        i++;
      } else {
        shipCells.push([anchorY,anchorX]);
        anchorX++;
        i++;
      }
    }
    shipToPlace.ship.cells = shipCells
  },

  select: (e, ) => {
    let targetElement = placing_getTargetElement(e);
    let type = shipToPlace.getShipType(targetElement); 

    if (!type) return;

    if (type === shipToPlace.ship.code) {
      shipToPlace.cancelSelect();
      return
    }

    shipToPlace.remove();
    shipToPlace.getNewShip(type);
    shipToPlace.draw();
    shipToPlace.highlightSelectedIcon();
  },

  cancelSelect: () => {
    shipToPlace.ship = { length: null, code: null };
    shipToPlace.cells = null;
    shipToPlace.anchor = null;
    shipToPlace.orientation = null;

    shipToPlace.remove();

    const icons = {
      boat: document.getElementById("icon_boat"),
      cruiser: document.getElementById("icon_cruiser"),
      submarine: document.getElementById("icon_submarine"),
      battleship: document.getElementById("icon_battleship"),
      carrier: document.getElementById("icon_carrier")
    };

    for (let ship in icons) {
      let icon = icons[ship];
      icon.classList.remove("selected")
    };
  },

  reselect: (type) => {
    if (!type) return;

    //Removing ship from fleet
    let index = player1.gameboard.fleet.indexOf(player1.gameboard.fleet.find((ship) => ship.type === type));
    let ship = player1.gameboard.fleet.splice(index, 1)[0];
    let cells = ship.cells;

    //Clearing gameboard
    for (let cell of cells) {
      player1.gameboard.board[cell[0]][cell[1]].ship = null;
    }

    //Setting ship to move
    shipToPlace.ship = ship;
    shipToPlace.lastAnchor = cells[0];

    //Deleting old board event listeners
    for (let cell of cells) {
      let el = document.getElementById(`dL-[${cell[0]},${cell[1]}]`);
      el.removeEventListener("click", placing_handleClick);
    }

    //Reactivating icon event listener
    document.getElementById(`icon_${ship.type}`).addEventListener("click", shipToPlace.select)

    displayPlayerBoard("left");
    shipToPlace.remove();
    shipToPlace.draw();
    shipToPlace.highlightSelectedIcon();
  },

  remove: () => {
    let shipToPlaceSVG = document.getElementById("shipToPlace");
    if (shipToPlaceSVG) {
      let parent = shipToPlaceSVG.parentElement;
      parent.removeChild(shipToPlaceSVG);
    }
  },
  
  place: async () => {
    if(!shipToPlace.ship.length) return;

    if(player1.gameboard.isValidShipPlacement(shipToPlace.ship.cells)) {
      player1.gameboard.placeShip(shipToPlace.ship.code, shipToPlace.ship.cells);
      await displayPlayerBoard("left");
      shipToPlace.markIconAsPlaced();

      //Adding event listeners to ship cells to be able to move it later
      for (let coord of shipToPlace.ship.cells) {
        let el = document.getElementById(`dL-[${coord[0]},${coord[1]}]`);
        el.addEventListener("click", placing_handleClick);
      }
      shipToPlace.cancelSelect();
    }
  },

  drawIcons: () => {
    let icons = {
      boat: {type: "boat", length: 2, orientation: "horizontal", anchor: [0,0]},
      cruiser: {type: "cruiser", length: 3, orientation: "horizontal", anchor: [2,0]},
      submarine: {type: "submarine", length: 3, orientation: "horizontal", anchor: [4,0]},
      battleship: {type: "battleship", length: 4, orientation: "horizontal", anchor: [6,0]},
      carrier: {type: "carrier", length: 5, orientation: "horizontal", anchor: [8,0]}
    }

    drawShip(icons.boat, "right", {id: "icon_boat", classes: ["icon"]});
    drawShip(icons.cruiser, "right", {id: "icon_cruiser", classes: ["icon"]});
    drawShip(icons.submarine, "right", {id: "icon_submarine", classes: ["icon"]});
    drawShip(icons.battleship, "right", {id: "icon_battleship", classes: ["icon"]});
    drawShip(icons.carrier, "right", {id: "icon_carrier", classes: ["icon"]});
  },

  removeIcons: () => {
    const icons = {
      boat: document.getElementById("icon_boat"),
      cruiser: document.getElementById("icon_cruiser"),
      submarine: document.getElementById("icon_submarine"),
      battleship: document.getElementById("icon_battleship"),
      carrier: document.getElementById("icon_carrier")
    };

    for(let icon in icons) {
      let element = icons[icon];
      let parent = element.parentElement;
      parent.removeChild(element)
    }
  },

  highlightSelectedIcon: () => {
    const icons = {
      boat: document.getElementById("icon_boat"),
      cruiser: document.getElementById("icon_cruiser"),
      submarine: document.getElementById("icon_submarine"),
      battleship: document.getElementById("icon_battleship"),
      carrier: document.getElementById("icon_carrier")
    };

    for (let ship in icons) {
      let icon = icons[ship];
      icon.classList.remove("selected")
    };

    if (shipToPlace.ship.code === "5") {
      icons.carrier.classList.remove("placed");
      icons.carrier.classList.add("selected");
    } else if (shipToPlace.ship.code === "4") {
      icons.battleship.classList.remove("placed");
      icons.battleship.classList.add("selected");
    } else if (shipToPlace.ship.code === "3b") {
      icons.submarine.classList.remove("placed");
      icons.submarine.classList.add("selected");
    } else if (shipToPlace.ship.code === "3a") {
      icons.cruiser.classList.remove("placed");
      icons.cruiser.classList.add("selected");
    } else if (shipToPlace.ship.code === "2") {
      icons.boat.classList.remove("placed");
      icons.boat.classList.add("selected");
    } 
  },

  markIconAsPlaced: () => {
    const icons = {
      boat: document.getElementById("icon_boat"),
      cruiser: document.getElementById("icon_cruiser"),
      submarine: document.getElementById("icon_submarine"),
      battleship: document.getElementById("icon_battleship"),
      carrier: document.getElementById("icon_carrier")
    };

    if (shipToPlace.ship.type === "boat") {
      icons.boat.classList.add("placed");
      icons.boat.removeEventListener("click", shipToPlace.select)
    } else if (shipToPlace.ship.type === "cruiser") {
      icons.cruiser.classList.add("placed");
      icons.cruiser.removeEventListener("click", shipToPlace.select);
    } else if (shipToPlace.ship.type === "submarine") {
      icons.submarine.classList.add("placed");
      icons.submarine.removeEventListener("click", shipToPlace.select);
    } else if (shipToPlace.ship.type === "battleship") {
      icons.battleship.classList.add("placed");
      icons.battleship.removeEventListener("click", shipToPlace.select);
    } else if (shipToPlace.ship.type === "carrier") {
      icons.carrier.classList.add("placed");
      icons.carrier.removeEventListener("click", shipToPlace.select);
    } 
  },

  getShipType: (el) => {
    let type;
    let list = Array.from(el.classList);

    if(list.includes("boat")) type = "2";
    else if(list.includes("cruiser")) type = "3a";
    else if (list.includes("submarine")) type = "3b";
    else if (list.includes("battleship")) type = "4";
    else if (list.includes("carrier")) type = "5";

    return type;
  },
};

export function placing_start() {
  // Need to make sure that display sets to Player 1

  shipToPlace.drawIcons();
  placing_addEventListeners();
}

export function placing_finish() {
  shipToPlace.removeIcons();
  placing_removeEventListeners(); 
  //Remove Event Listeners
}

function placing_handleClick(e) {
  let cellY = e.target.id[4];
  let cellX = e.target.id[6];
  let type = player1.gameboard.board[cellY][cellX].ship.type;

  shipToPlace.reselect(type);
}

async function placing_refreshTargetCell(e) {
  shipToPlace.remove();

  let targetCellY = parseInt(e.target.id[4]);
  let targetCellX = parseInt(e.target.id[6]);

  if (shipToPlace.ship.orientation === "vertical" && 10 - targetCellY < shipToPlace.ship.length) {
    targetCellY = 10 - shipToPlace.ship.length;
  } else if (shipToPlace.ship.orientation === "horizontal" && 10 - targetCellX < shipToPlace.ship.length) {
    targetCellX = 10 - shipToPlace.ship.length;
  }
  shipToPlace.ship.anchor = [targetCellY, targetCellX];
  shipToPlace.lastAnchor = [targetCellY, targetCellX];
}

async function placing_handleMouseOver(e) {
  if(!shipToPlace.ship.length) return;

  const now = Date.now();
  if (now - placing_lastMouseOverTime < 10) {
    return;
  }
  placing_lastMouseOverTime = now;

  await placing_refreshTargetCell(e);

  shipToPlace.draw();
}

function placing_getTargetElement(e) {
  let targetElement = e.target;
  if (targetElement.tagName !== "svg") targetElement = targetElement.parentElement;
  return targetElement;
}

function placing_addEventListeners() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.addEventListener("mouseover", placing_handleMouseOver)
    cell.addEventListener("click", shipToPlace.place)
  };

  const icons = {
    boat: document.getElementById("icon_boat"),
    cruiser: document.getElementById("icon_cruiser"),
    submarine: document.getElementById("icon_submarine"),
    battleship: document.getElementById("icon_battleship"),
    carrier: document.getElementById("icon_carrier")
  };

  for (let ship in icons) {
    let icon = icons[ship];
    icon.addEventListener("click", shipToPlace.select)
  };
}

function placing_removeEventListeners() {
  let board = document.getElementById("container_cellsLeft");
  let cells = Array.from(board.children);

  for (let cell of cells) {
    cell.removeEventListener("mouseover", placing_handleMouseOver)
    cell.removeEventListener("click", shipToPlace.place)
  };
}