const main = document.getElementById("main");

export function displayScreen_battle() {
  drawFireBoard()
}

function drawFireBoard() {
  const fireBoard_container = document.createElement("div");
  fireBoard_container.id = "battle_fireBoard_container";
  main.appendChild(fireBoard_container)

  const _drawFireBoard_main = () => {
    const fireBoard_main = document.createElement("div");
    fireBoard_main.id = "battle_fireBoardMain";
    fireBoard_main.style.gridArea = "fireBoardMain"
    for (let y = 9; y >= 0; y--) {
      for (let x = 0; x <= 9; x++) {
        const cell = document.createElement("div");
        cell.classList.add("battle_fireBoard_cell")
        cell.id = `fB-[${y},${x}]`
        fireBoard_main.appendChild(cell)
        cell.addEventListener("mouseover", displayCrosshair)
      }
    }
    fireBoard_container.appendChild(fireBoard_main)
  }

  const _drawFireBoard_borders = () => {
    const boardTop = document.createElement("div");
    const boardLeft = document.createElement("div");
    const boardRight = document.createElement("div");
    const boardBottom = document.createElement("div");
    const corner1 = document.createElement("div");
    const corner2 = document.createElement("div");
    const corner3 = document.createElement("div");
    const corner4 = document.createElement("div");

    boardTop.classList.add("battle_fireBoard_border");
    boardLeft.classList.add("battle_fireBoard_border");  
    boardRight.classList.add("battle_fireBoard_border");
    boardBottom.classList.add("battle_fireBoard_border");
    corner1.classList.add("battle_fireBoard_border");
    corner2.classList.add("battle_fireBoard_border");
    corner3.classList.add("battle_fireBoard_border");
    corner4.classList.add("battle_fireBoard_border");

    boardTop.style.gridArea = "fireBoardTop";
    boardLeft.style.gridArea = "fireBoardLeft";
    boardRight.style.gridArea = "fireBoardRight";
    boardBottom.style.gridArea = "fireBoardBottom";
    corner1.style.gridArea = "fireBoardCorner1";
    corner2.style.gridArea = "fireBoardCorner2";
    corner3.style.gridArea = "fireBoardCorner3";
    corner4.style.gridArea = "fireBoardCorner4";

    boardLeft.classList.add("battle_fireBoard_markingLeft");
    boardRight.classList.add("battle_fireBoard_markingRight");
    boardTop.classList.add("battle_fireBoard_markingTop");
    boardBottom.classList.add("battle_fireBoard_markingBottom");

    const letters = ["J", "I", "H", "G", "F", "E", "D", "C", "B", "A"]
    for(let i = 0; i < 10; i++) {
      let markLeft = document.createElement("div");
      let markRight = document.createElement("div");
      let markTop = document.createElement("div");
      let markBottom = document.createElement("div");

      markLeft.innerText = letters[i];
      markRight.innerText = letters[i];
      markTop.innerText = i + 1;
      markBottom.innerText = i + 1;

      boardLeft.appendChild(markLeft);
      boardRight.appendChild(markRight);
      boardTop.appendChild(markTop);
      boardBottom.appendChild(markBottom);
    }


    fireBoard_container.appendChild(boardTop);
    fireBoard_container.appendChild(boardLeft);
    fireBoard_container.appendChild(boardRight);
    fireBoard_container.appendChild(boardBottom);
    fireBoard_container.appendChild(corner1);
    fireBoard_container.appendChild(corner2);
    fireBoard_container.appendChild(corner3);
    fireBoard_container.appendChild(corner4);
  }

  _drawFireBoard_main()
  _drawFireBoard_borders()
}


function displayCrosshair(event) {
  document.querySelectorAll(".battle_fireBoard_cell").forEach(el => {
    el.classList.remove("battle_crosshair_Y");
    el.classList.remove("battle_crosshair_X");
    el.classList.remove("battle_crosshair_target");
  });

  const elementID = event.target.id
  const targetY = elementID[4];
  const targetX = elementID[6];
  const sameY = [];
  const sameX = [];
  for (let i = 0; i <= 9; i++) {
    if (i != targetY) sameY.push(`fB-[${i},${targetX}]`)
    if (i != targetX) sameX.push(`fB-[${targetY},${i}]`)
  }

  document.getElementById(`${elementID}`).classList.add("battle_crosshair_target")
  sameY.forEach(coord => {
    document.getElementById(`${coord}`).classList.add("battle_crosshair_Y")
  })
  sameX.forEach(coord => {
    document.getElementById(`${coord}`).classList.add("battle_crosshair_X")
  })
}