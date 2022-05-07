import { Main } from "./main.js";
import { XY } from "./position.js";

export class Sprite {
  private velocity: XY;
  private gravity: number = 1;
  private color: string;

  public direction: "left" | "right" = "right";
  public lastKey: string = "";
  public width: number;
  public height: number;
  public position: XY;
  public attackBox: { position: XY; size: { width: number; height: number } };
  public isAttacking = false;
  public health = 100;

  constructor(props: { position: XY; velocity: XY; color: string; size: XY }) {
    this.position = props.position;
    this.velocity = props.velocity;
    this.color = props.color;

    this.height = props.size.y;
    this.width = props.size.x;

    this.attackBox = {
      position: this.position,
      size: { width: 150, height: 50 },
    };
  }

  private drawAttackBox(direction: "left" | "right") {
    if (!this.isAttacking) return;
    Main.c.strokeStyle = "green";
    let x = 0;
    if (direction === "left") {
      x = this.width + this.attackBox.position.x - this.attackBox.size.width;
    }
    if (direction === "right") {
      x = this.attackBox.position.x;
    }
    Main.c.strokeRect(
      x,
      this.attackBox.position.y,
      this.attackBox.size.width,
      this.attackBox.size.height
    );
  }
  private drawLeft() {
    this.drawBody();
    this.drawAttackBox("left");
  }

  private drawRight() {
    this.drawBody();
    this.drawAttackBox("right");
  }

  private drawBody() {
    Main.c.fillStyle = this.color;
    Main.c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  private draw() {
    if (this.direction === "right") return this.drawRight();
    if (this.direction === "left") return this.drawLeft();
  }

  public update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y += this.gravity;

    if (this.position.y + this.height > Main.canvas.height) {
      this.position.y = Main.canvas.height - this.height;
      this.velocity.y = 0;
    }

    if (
      this.position.x < 0 ||
      this.position.x + this.width > Main.canvas.width
    ) {
      this.position.x = Math.max(
        0,
        Math.min(Main.canvas.width - this.width, this.position.x)
      );
    }
    this.draw();
  }

  public goRight() {
    this.direction = "right";
    this.velocity.x = 10;
  }

  public goLeft() {
    this.direction = "left";
    this.velocity.x = -10;
  }

  public jump() {
    this.velocity.y = -20;
  }

  public stopHorizontal() {
    this.velocity.x = 0;
  }

  public attack(other: Sprite) {
    if (!this.canAttack(other)) return;
    this.isAttacking = true;
    other.health -= 10;
    if (other.health <= 0) {
      other.health = 0;
    }
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  private canAttack(other: Sprite): boolean {
    if (this.direction === "right") {
      return (
        this.attackBox.position.x + this.attackBox.size.width >=
          other.position.x &&
        this.attackBox.position.x <= other.position.x + other.width &&
        this.attackBox.position.y + this.attackBox.size.height >=
          other.position.y &&
        this.attackBox.position.y <= other.position.y + other.height
      );
    }

    if (this.direction === "left") {
      return (
        this.width + this.attackBox.position.x - this.attackBox.size.width >=
          other.position.x &&
        this.width + this.attackBox.position.x - this.attackBox.size.width <=
          other.position.x + other.width &&
        this.attackBox.position.y + this.attackBox.size.height >=
          other.position.y &&
        this.attackBox.position.y <= other.position.y + other.height
      );
    }
    return false;
  }
}
