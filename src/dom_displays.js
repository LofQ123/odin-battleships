import { containers } from "./dom";

export async function drawGrid(display) {
  buildGrid(display)
  animateGrid(display)
}

function buildGrid(display) {
  let cells;
  display === "left"
    ? cells = containers.main.center.gameboard.left.cells
    : cells = containers.main.center.gameboard.right.cells
  
    for (let y = 0; y <= 9; y++) {
    for (let x = 0; x <= 9; x++) {
      const cell = document.createElement("div");

      if (display === "left") {
        cell.classList.add("displayLeft_cell")
        cell.id = `dL-[${y},${x}]`
      } else {
        cell.classList.add("displayRight_cell")
        cell.id = `dR-[${y},${x}]`
      }

      cells.appendChild(cell)
      if (display === "left") cell.addEventListener("mouseover", displayCrosshair)
    }
  }
}

function displayCrosshair(event) {
  document.querySelectorAll(".displayLeft_cell").forEach(el => {
    el.classList.remove("displayLeft_crosshair_Y");
    el.classList.remove("displayLeft_crosshair_X");
    el.classList.remove("displayLeft_crosshair_target");
  });

  const elementID = event.target.id
  const targetY = elementID[4];
  const targetX = elementID[6];
  const sameY = [];
  const sameX = [];
  for (let i = 0; i <= 9; i++) {
    if (i != targetY) sameY.push(`dL-[${i},${targetX}]`)
    if (i != targetX) sameX.push(`dL-[${targetY},${i}]`)
  }

  document.getElementById(`${elementID}`).classList.add("displayLeft_crosshair_target")
  sameY.forEach(coord => {
    document.getElementById(`${coord}`).classList.add("displayLeft_crosshair_Y")
  })
  sameX.forEach(coord => {
    document.getElementById(`${coord}`).classList.add("displayLeft_crosshair_X")
  })
}

function animateGrid(display) {
  const cells = [];
  for(let y = 0; y < 10; y++) {
    const row = [];
    for(let x = 0; x < 10; x++) {
      let element;
      display === "left"
        ? element = document.getElementById(`dL-[${y},${x}]`)
        : element = document.getElementById(`dR-[${y},${x}]`)
      row.push(element)
    }
    cells.push(row)
  }

  let time = 20;
  let timeout;
  display === "left"
    ? timeout = time*50
    : timeout = time* 140

  const interval = setInterval(() => {
    let currentIndex = 0;
    const animate = setInterval(() => {    
      const row = cells[currentIndex];
      row.forEach((cell) => {
      cell.classList.add("highlighted");
      });
     
      const rowBefore = cells[currentIndex - 1];
      if (rowBefore) {
      rowBefore.forEach((cell) => {
      cell.classList.remove("highlighted");
      });
      }
     
      currentIndex++;
      if (currentIndex === cells.length) {
        currentIndex = 0;
      }
    }, time);
    
    setTimeout(() => {
      clearInterval(animate);
    }, time*10);

    setTimeout(() => {
      cells[9].forEach((cell) => {
        cell.classList.remove("highlighted");
      });
    }, time*11);
  }, timeout);
  
  return interval;
}