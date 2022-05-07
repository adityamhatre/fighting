import { Game } from "./game.js";
import { Main } from "./main.js";
import { Sprite } from "./sprite.js";

const width = 1024;
const height = 768;
const canvas = Main.canvas;
const c = Main.c;

canvas.width = width;
canvas.height = height;

c.fillRect(0, 0, canvas.width, canvas.height);

const game = new Game();
game.start();
