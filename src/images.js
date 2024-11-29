import svg_head_bottom from "./svg/head_bottom.svg";
import svg_head_top from "./svg/head_top.svg";
import svg_frame_left from "./svg/frame_left.svg";
import svg_frame_right from "./svg/frame_right.svg";
import svg_background from "./svg/background.svg";
import svg_sidebarLeft from "./svg/sidebarLeft.svg";
import svg_sidebarRight from "./svg/sidebarRight.svg";
import svg_middleBar from "./svg/middleBar.svg";
import svg_displayLeft from "./svg/displayLeft.svg";
import svg_displayRight from "./svg/displayRight.svg";
import svg_gameboard from "./svg/gameboard.svg";
import svg_buttonGray from "./svg/buttonGray.svg";
import svg_buttonYellow from "./svg/buttonYellow.svg";
import { boat_svg } from "./assets/ship_boat";
import { cruiser_svg } from "./assets/ship_cruiser";
import { submarine_svg } from "./assets/ship_submarine";
import { battleship_svg } from "./assets/ship_battleship";
import { carrier_svg } from "./assets/ship_carrier";
import { dot_svg } from "./assets/marks";
import { bang_svg } from "./assets/marks";


export const ui = {
  background: svg_background,
  head: {
    top: svg_head_top,
    bottom: svg_head_bottom,
  },
  frame: {
    left: svg_frame_left,
    right: svg_frame_right,
  },
  main: {
    sidebarLeft: svg_sidebarLeft,
    sidebarRight: svg_sidebarRight,
    center: {
      middleBar: svg_middleBar,
      displayLeft: svg_displayLeft,
      displayRight: svg_displayRight,
      buttonGray: svg_buttonGray,
      buttonYellow: svg_buttonYellow,
    },
    gameboard: svg_gameboard,
  }
}

export const ships = {
  boat: boat_svg,
  cruiser: cruiser_svg,
  submarine: submarine_svg,
  battleship: battleship_svg,
  carrier: carrier_svg,
}

export const marks = {
  dot: dot_svg,
  bang: bang_svg,
}

/* function _create(svg, tempID) {
  return new Promise((resolve) => {
    let temp = document.getElementById("temp");
    let obj = document.createElement("object");
    obj.setAttribute("data", svg);
    obj.setAttribute("type", "image/svg+xml");
    obj.style.width = "0px";
    obj.style.height = "0px";
    obj.id = `obj-${tempID}`;
  
    obj.addEventListener("load", function() {
      let _obj = obj;
      let _content = obj.contentDocument;
      let _document = obj.contentDocument.documentElement;
      let svg = obj.contentDocument.documentElement;
      console.log(_obj);
      console.log(_content);
      console.log(_document);
      svg.id = `svg-${tempID}`;

      temp.appendChild(svg);
      resolve(svg);
    });
  
    temp.appendChild(obj);
  });
}

async function _append(svg, tempID) {
  let el = await _create(svg, tempID);
  let clone;
  let tempObj = document.getElementById(`obj-${tempID}`)
  let tempSVG = document.getElementById(`svg-${tempID}`);
  clone = tempSVG.cloneNode(true);
  clone.id = "";
  let parent = tempSVG.parentElement;
  parent.removeChild(tempSVG);
  document.getElementById("temp").removeChild(tempObj)
  return clone;
} */