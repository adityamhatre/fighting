import { Game } from "./game.js";
import { Constants } from "./constants.js";

const width = Constants.width;
const height = Constants.height;
const canvas = Constants.canvas;
const c = Constants.c;

canvas.width = width;
canvas.height = height;

c.fillRect(0, 0, canvas.width, canvas.height);

const game = new Game();
game.start();
