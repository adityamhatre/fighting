import { FighterProps } from "./fighter.props.js";
import { Main } from "./main.js";
import { XY } from "./position.js";

export class Fighter {
  private velocity: XY;
  private gravity: number = 1;
  private color: string;

  public direction: "left" | "right" = "right";
  public lastKey: string = "";
  public width: number;
  public height: number;
  public position: XY;
  public attackBox: {
    position: XY;
    size: { width: number; height: number };
  };
  public hitBox: {
    position: XY;
    size: { width: number; height: number };
  };
  public isPerformingAction = false;
  public health = 100;
  public action: "run" | "jump" | "idle" | "attack1" | "attack2" | "fall" =
    "idle";

  private image = new Image();
  private props: FighterProps;
  private framesElapsed = 0;
  private holdFrame = 5;
  private currentFrame = 0;

  constructor(props: FighterProps) {
    this.props = props;
    this.props.scale = 2;
    this.position = props.position;
    this.velocity = props.velocity;
    this.color = props.color;

    this.height = props.size.y;
    this.width = props.size.x;

    this.direction = this.props.type === "player" ? "right" : "left";
    this.attackBox = {
      position: { ...this.position },
      size: { width: 75 * this.props.scale, height: 25 * this.props.scale },
    };
    this.hitBox = {
      position: { ...this.position },
      size: {
        width: this.props.hitBoxOffset.size.width * this.props.scale,
        height: this.props.hitBoxOffset.size.height * this.props.scale,
      },
    };

    this.image.src = props.imgSrc;
    this.image.onload = () => {
      this.height = this.props.scale * this.image.height;
      this.width = (this.props.scale * this.image.width) / this.props.frames;
    };
  }

  private drawAttackBox() {
    // if (!this.isPerformingAction) return;
    Main.c.strokeStyle = "green";

    Main.c.strokeRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.size.width,
      this.attackBox.size.height
    );
  }

  private drawHitBox() {
    Main.c.strokeStyle = "red";
    Main.c.strokeRect(
      this.hitBox.position.x,
      this.hitBox.position.y,
      this.hitBox.size.width,
      this.hitBox.size.height
    );
  }

  private drawLeft() {
    this.attackBox.position.x =
      this.position.x + (this.width / 2 - this.attackBox.size.width);
    this.attackBox.position.y = this.position.y + 80 * this.props.scale;

    this.hitBox.position.x =
      this.position.x + this.width / 2 - 20 * this.props.scale;
    this.hitBox.position.y = this.position.y + 65 * this.props.scale;

    this.drawBody();
    // this.drawAttackBox();
    // this.drawHitBox();
  }

  private drawRight() {
    this.attackBox.position.x = this.position.x + this.width / 2;
    this.attackBox.position.y = this.position.y + 80 * this.props.scale;

    this.hitBox.position.x =
      this.position.x + this.width / 2 - 20 * this.props.scale;
    this.hitBox.position.y = this.position.y + 65 * this.props.scale;

    this.drawBody();
    this.drawAttackBox();
    this.drawHitBox();
  }

  private drawBody() {
    Main.c.fillStyle = this.color;
    Main.c.strokeRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    Main.c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.props.frames),
      0,
      this.image.width / this.props.frames,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.props.scale * this.image.width) / this.props.frames,
      this.props.scale * this.image.height
    );
  }

  private draw() {
    this.image.src = `../src/assets/${this.props.type}-${this.direction}/${this.action}.png`;

    if (this.framesElapsed++ % this.holdFrame == 0) {
      if (++this.currentFrame >= this.props.frames) {
        this.currentFrame = 0;
      }
      this.framesElapsed = 1;
    }
    if (this.direction === "right") return this.drawRight();
    if (this.direction === "left") return this.drawLeft();
  }

  public update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y += this.gravity;
    // here
    const hitBoxBase =
      this.position.y + 65 * this.props.scale + this.hitBox.size.height;

    // Main.c.strokeStyle = "yellow";
    // Main.c.strokeRect(0, hitBoxBase, 1000, 0);
    if (hitBoxBase >= 700) {
      this.velocity.y = 0;
      this.position.y = 700 - 65 * this.props.scale - this.hitBox.size.height;
    }

    if (this.hitBox.position.x < 0) {
      this.position.x = -80 * this.props.scale;
    }
    if (this.hitBox.position.x + this.hitBox.size.width > Main.canvas.width) {
      this.position.x = Main.canvas.width - 115 * this.props.scale;
    }

    this.draw();
  }

  public goRight() {
    this.action = "run";
    this.props.frames = 8;

    this.direction = "right";
    this.velocity.x = 3;
  }

  public goLeft() {
    this.action = "run";
    this.props.frames = 8;

    this.direction = "left";
    this.velocity.x = -3;
  }

  public jump() {
    if (this.isPerformingAction) return;

    this.isPerformingAction = true;
    this.action = "jump";
    this.props.frames = 2;

    setTimeout(() => {
      this.action = "fall";
      this.props.frames = 2;
    }, 300);

    setTimeout(() => {
      this.isPerformingAction = false;
      this.action = "idle";
      this.props.frames = 8;
    }, 700);

    this.velocity.y = -20;
  }

  public stopHorizontal() {
    if (this.isPerformingAction) return;

    this.action = "idle";
    this.props.frames = 8;
    this.velocity.x = 0;
  }

  public attack(other: Fighter) {
    if (this.isPerformingAction) return;

    this.action = Math.random() > 0.5 ? "attack1" : "attack2";
    this.props.frames = 6;
    this.isPerformingAction = true;
    setTimeout(() => {
      this.isPerformingAction = false;
      this.action = "idle";
      this.props.frames = 8;
    }, 300);

    if (!this.canAttack(other)) return;
    other.health -= 10;
    if (other.health <= 0) {
      other.health = 0;
    }
  }

  private canAttack(other: Fighter): boolean {
    if (this.direction === "right") {
      return (
        this.attackBox.position.x + this.attackBox.size.width >=
          other.hitBox.position.x &&
        this.attackBox.position.x <=
          other.hitBox.position.x + other.hitBox.size.width &&
        this.attackBox.position.y + this.attackBox.size.height >=
          other.hitBox.position.y &&
        this.attackBox.position.y <=
          other.hitBox.position.y + other.hitBox.size.height
      );
    }

    if (this.direction === "left") {
      return (
        this.attackBox.position.x <=
          other.hitBox.position.x + other.hitBox.size.width &&
        this.attackBox.position.x + this.attackBox.size.width >=
          other.hitBox.position.x &&
        this.attackBox.position.y + this.attackBox.size.height >=
          other.hitBox.position.y &&
        this.attackBox.position.y <=
          other.hitBox.position.y + other.hitBox.size.height
      );
    }
    return false;
  }
}
