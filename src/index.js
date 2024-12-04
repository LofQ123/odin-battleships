import "./rest.css";
import "./styles.css";
import "./displays.css";
import "./abilities.css";
import "./dom.js";
import "./dom_abilities.js"
import "./dom_displays.js";
import "./dom_log.js";
import "./ai.js";
import { displayVersion, draw_mainFrame, draw_startScreen } from "./dom.js";

export const currentVersion = "v0.9";

displayVersion();
draw_mainFrame();
draw_startScreen();
