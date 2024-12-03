import { player1, player2 } from "./dom";

const logContainer = document.getElementById("container_log");

export function logMessage(text, options = {}) {
  let playerString;
  let msg = document.createElement("div");
  msg.classList.add("logMsg");

  if (options.player) {
    options.player === player1
    ? playerString = `<span class="logPlayer1">[${player1.name}]</span>`
    : playerString = `<span class="logPlayer2">[${player2.name}]</span>`;
  }
    
  let cellsString;
  if (options.cells && options.player === player1) cellsString = `<span class="logPlayer1">${convertCoordinates(options.cells)}</span>`
  else if (options.cells && options.player === player2) cellsString = `<span class="logPlayer2">${convertCoordinates(options.cells)}</span>`
  else if (options.cells && !options.player) cellsString = `<span class="logSystem">${convertCoordinates(options.cells)}</span>`

  let logMsg;
  if (options.player) logMsg = `${playerString} ${text}`;
  else logMsg = `<span class="logSystem">${text}</span>`;

  if (options.cells) logMsg = `${logMsg} ${cellsString}`

  msg.innerHTML = logMsg;
  logContainer.appendChild(msg);
  msg.scrollIntoView();
}

function convertCoordinates(coordinates) {
  const Y = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const X = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  let output;

  if (typeof(coordinates[0]) !== "object") {
    output = `[${Y[coordinates[0]]}${X[coordinates[1]]}]`
  } else {
    let processedCells = [];
    for (let set of coordinates) {
      processedCells.push(`${Y[set[0]]}${X[set[1]]}`)
    }
    output = `[${processedCells.toString(",")}]`;
  }
  return output
}

