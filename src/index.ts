import { Game } from "./game.js";
import { Main } from "./main.js";

const width = Main.width;
const height = Main.height;
const canvas = Main.canvas;
const c = Main.c;

canvas.width = width;
canvas.height = height;

c.fillRect(0, 0, canvas.width, canvas.height);

const game = new Game();
game.start();
