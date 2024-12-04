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
import svg_bomb from "./svg/icon_bomb.svg";
import svg_bomb_gray from "./svg/icon_bomb_gray.svg";
import svg_torpedo from "./svg/icon_torpedo.svg";
import svg_torpedo_gray from "./svg/icon_torpedo_gray.svg";
import svg_double from "./svg/icon_double.svg";
import svg_double_gray from "./svg/icon_double_gray.svg";
import svg_mine from "./svg/icon_mine.svg";
import svg_mine_gray from "./svg/icon_mine_gray.svg";
import svg_shipWhiteFill from "./svg/ship_white_fill.svg";
import svg_shipRedFill from "./svg/ship_red_fill.svg";
import svg_shipWhiteStroke from "./svg/ship_white_stroke.svg";
import svg_shipRedStroke from "./svg/ship_red_stroke.svg";
import svg_logo from "./svg/logo.svg";
import svg_gitLogo from "./svg/gitLogo.svg"

import { boat_svg } from "./assets/ship_boat";
import { cruiser_svg } from "./assets/ship_cruiser";
import { submarine_svg } from "./assets/ship_submarine";
import { battleship_svg } from "./assets/ship_battleship";
import { carrier_svg } from "./assets/ship_carrier";
import { dot_svg } from "./assets/marks";
import { bang_svg } from "./assets/marks";
import { mine_svg } from "./assets/mine";

import cat_img from "./assets/avatar_cat.jpg";
import dog_img from "./assets/avatar_dog.jpg";


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
  },
  icons: {
    bomb: svg_bomb,
    bomb_gray: svg_bomb_gray,
    torpedo: svg_torpedo,
    torpedo_gray: svg_torpedo_gray,
    double: svg_double,
    double_gray: svg_double_gray,
    mine: svg_mine,
    mine_gray: svg_mine_gray
  },
  logo: svg_logo,
  gitLogo: svg_gitLogo
}

export const ships = {
  boat: boat_svg,
  cruiser: cruiser_svg,
  submarine: submarine_svg,
  battleship: battleship_svg,
  carrier: carrier_svg,
  mine: mine_svg,
  icons: {
    whiteF: svg_shipWhiteFill,
    whiteS: svg_shipWhiteStroke,
    redF: svg_shipRedFill,
    redS: svg_shipRedStroke
  }
}

export const marks = {
  dot: dot_svg,
  bang: bang_svg,
}

export const avatars = {
  cat: cat_img,
  dog: dog_img,
}