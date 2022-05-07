import { Keys } from "./Keys.js";
import { Main } from "./main.js";
import { Sprite } from "./sprite.js";

export class Game {
  private player: Sprite;
  private enemy: Sprite;
  private gameTimer = 15;

  constructor() {
    [this.player, this.enemy] = this.initPlayers();
    this.loop = this.loop.bind(this);
  }

  private initPlayers(): Sprite[] {
    const player = new Sprite({
      position: { x: 50, y: 100 },
      velocity: { x: 0, y: 0 },
      size: { x: 50, y: 150 },
      color: "red",
    });

    const enemy = new Sprite({
      position: { x: 900, y: 100 },
      velocity: { x: 0, y: 0 },
      size: { x: 50, y: 150 },
      color: "blue",
    });
    return [player, enemy];
  }

  private addEventListeners() {
    addEventListener("keydown", (event: KeyboardEvent) => {
      const key = event.key;
      switch (key) {
        case "d":
          Keys.d.pressed = true;
          this.player.lastKey = "d";
          break;
        case "a":
          Keys.a.pressed = true;
          this.player.lastKey = "a";
          break;
        case "w":
          Keys.w.pressed = true;
          this.player.lastKey = "w";
          break;
        case " ":
          this.player.attack(this.enemy);
          break;
        case "ArrowLeft":
          Keys.ArrowLeft.pressed = true;
          this.enemy.lastKey = "ArrowLeft";
          break;
        case "ArrowRight":
          Keys.ArrowRight.pressed = true;
          this.enemy.lastKey = "ArrowRight";
          break;
        case "ArrowUp":
          Keys.ArrowUp.pressed = true;
          this.enemy.lastKey = "ArrowUp";
          break;
        case "Enter":
        case "Return":
          this.enemy.attack(this.player);
          break;
      }
    });

    addEventListener("keyup", (event: KeyboardEvent) => {
      const key = event.key;
      switch (key) {
        case "d":
          Keys.d.pressed = false;
          break;
        case "a":
          Keys.a.pressed = false;
          break;
        case "w":
          Keys.w.pressed = false;
          break;

        case "ArrowLeft":
          Keys.ArrowLeft.pressed = false;
          break;
        case "ArrowRight":
          Keys.ArrowRight.pressed = false;
          break;
        case "ArrowUp":
          Keys.ArrowUp.pressed = false;
          break;
      }
    });
  }

  private checkKeys() {
    if (
      this.player.health === 0 ||
      this.enemy.health === 0 ||
      this.gameTimer === 0
    )
      return;
    if (this.player.lastKey === "a" && Keys.a.pressed) {
      this.player.goLeft();
    }
    if (this.player.lastKey === "d" && Keys.d.pressed) {
      this.player.goRight();
    }
    if (this.player.lastKey === "w" && Keys.w.pressed) {
      this.player.jump();
    }
    if (!Keys.a.pressed && !Keys.d.pressed) {
      this.player.stopHorizontal();
    }

    if (Keys.ArrowLeft.pressed && this.enemy.lastKey === "ArrowLeft") {
      this.enemy.goLeft();
    }
    if (Keys.ArrowRight.pressed && this.enemy.lastKey === "ArrowRight") {
      this.enemy.goRight();
    }
    if (this.enemy.lastKey === "ArrowUp" && Keys.ArrowUp.pressed) {
      this.enemy.jump();
    }
    if (!Keys.ArrowLeft.pressed && !Keys.ArrowRight.pressed) {
      this.enemy.stopHorizontal();
    }
  }

  private loop() {
    requestAnimationFrame(this.loop);
    Main.c.fillStyle = "black";
    Main.c.fillRect(0, 0, Main.canvas.width, Main.canvas.height);
    this.checkKeys();
    this.player.update();
    this.enemy.update();

    this.updateInterface();
  }

  private updateInterface() {
    const enemyHealthBar = document.getElementById("enemyHealthBar");
    if (enemyHealthBar) {
      enemyHealthBar.style.width = `${this.enemy.health}%`;
    }

    const playerHealthBar = document.getElementById("playerHealthBar");
    if (playerHealthBar) {
      playerHealthBar.style.width = `${this.player.health}%`;
    }

    const status = document.getElementById("timer");
    if (status) {
      status.innerHTML = `${this.twoDigits(this.gameTimer)}`;
      if (this.gameTimer === 0) {
        this.determineWinner(status);
      }
      if (this.player.health === 0 || this.enemy.health === 0) {
        this.determineWinner(status);
      }
    }
  }

  private determineWinner(status: HTMLElement) {
    if (this.player.health > this.enemy.health) {
      status.innerHTML = "Player 1 win!";
    }
    if (this.player.health < this.enemy.health) {
      status.innerHTML = "Player 2 win!";
    }
    if (this.player.health == this.enemy.health) {
      status.innerHTML = "Draw!";
    }
  }

  private twoDigits(num: number) {
    return num < 10 ? `0${num}` : num;
  }

  private startTimer() {
    const interval = setInterval(() => {
      this.gameTimer--;
      if (this.gameTimer === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  public start() {
    this.addEventListeners();
    this.loop();
    this.startTimer();
  }
}
