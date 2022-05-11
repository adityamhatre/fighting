import { Constants } from "./constants.js";
import { FighterProps } from "./fighter.props.js";
import { Game } from "./game.js";
import { XY } from "./position.js";

export class Fighter {
  public lastKey: string = "";

  private velocity: XY;
  private gravity: number = 1;
  private direction: "left" | "right" = "right";
  private width: number;
  private height: number;
  private position: XY;
  private action:
    | "run"
    | "jump"
    | "idle"
    | "attack1"
    | "attack2"
    | "fall"
    | "takeHit"
    | "death" = "idle";

  private image = new Image();
  private props: FighterProps;
  private framesElapsed = 0;
  private holdFrame = 5;
  private currentFrame = 0;
  private attackType: 1 | 2 = 1;

  private attackBox: {
    position: XY;
    size: { width: number; height: number };
  };
  private hitBox: {
    position: XY;
    size: { width: number; height: number };
  };
  private isJumping = false;
  private isAttacking = false;
  private isTakingHit = false;
  private isDying = false;
  private isDead = false;

  public set takingHit(v: boolean) {
    this.isTakingHit = v;
    if (!v) return;
    setTimeout(() => {
      this.currentFrame = 0;
      this.framesElapsed = 1;
      this.isTakingHit = false;
    }, 200);
  }
  public health = 100;

  constructor(props: FighterProps) {
    this.props = props;
    this.position = props.position;
    this.velocity = props.velocity;

    this.height = props.size.y;
    this.width = props.size.x;

    this.direction = this.props.type === "player" ? "right" : "left";
    this.attackBox = {
      position: { ...this.position },
      size: { width: 75 * this.props.scale, height: 25 * this.props.scale }, // attack box size (values are in pixels)
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
    if (!this.props.debug) return;

    Constants.c.strokeStyle = "green";
    Constants.c.strokeRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.size.width,
      this.attackBox.size.height
    );
  }

  private drawHitBox() {
    if (!this.props.debug) return;

    Constants.c.strokeStyle = "red";
    Constants.c.strokeRect(
      this.hitBox.position.x,
      this.hitBox.position.y,
      this.hitBox.size.width,
      this.hitBox.size.height
    );
  }

  private computeAttackBoxPosition() {
    this.attackBox.position.x = this.position.x + this.width / 2;
    
    if (this.direction === "left") {
      this.attackBox.position.x -= this.attackBox.size.width;
    }

    this.attackBox.position.y = this.position.y + 80 * this.props.scale;
  }

  private computeHitBoxPosition() {
    this.hitBox.position.x =
      this.position.x + this.width / 2 - 20 * this.props.scale;
    this.hitBox.position.y = this.position.y + 65 * this.props.scale;
  }

  private computeBoxesPosition() {
    this.computeAttackBoxPosition();
    this.computeHitBoxPosition();
  }

  private drawBody() {
    Constants.c.drawImage(
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

  private determineAction() {
    if (this.velocity.x != 0) {
      this.action = "run";
    }
    if (this.velocity.y < 0) {
      this.action = "jump";
    }
    if (this.velocity.y > 0) {
      this.action = "fall";
    }
    if (this.velocity.x == 0 && this.velocity.y == 0) {
      this.action = "idle";
    }
    if (this.isAttacking) {
      this.action = `attack${this.attackType}`;
    }
    if (this.isTakingHit) {
      this.action = "takeHit";
    }
    if (this.health === 0) {
      this.action = "death";
    }

    this.props.frames =
      Constants.actionFrameCount[this.props.type][this.action];
  }

  private draw() {
    this.determineAction();

    if (this.framesElapsed++ % this.holdFrame == 0) {
      if (++this.currentFrame >= this.props.frames) {
        this.currentFrame = 0;

        if (this.isDying) {
          this.isDead = true;
        }
      }
      this.framesElapsed = 1;
    }

    if (this.isDead) {
      this.currentFrame =
        Constants.actionFrameCount[this.props.type]["death"] - 1;
    }

    this.image.src = `../src/assets/${this.props.type}-${this.direction}/${this.action}.png`;

    this.computeBoxesPosition();
    this.drawBody();
    this.drawAttackBox();
    this.drawHitBox();
  }

  public update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y += this.gravity;

    const hitBoxBase =
      this.position.y + 65 * this.props.scale + this.hitBox.size.height;
    this.isJumping = hitBoxBase < Constants.ground;

    if (hitBoxBase >= Constants.ground) {
      this.velocity.y = 0;
      this.position.y =
        Constants.ground - 65 * this.props.scale - this.hitBox.size.height;
    }

    if (this.hitBox.position.x < 0) {
      this.position.x = -80 * this.props.scale;
    }
    if (
      this.hitBox.position.x + this.hitBox.size.width >
      Constants.canvas.width
    ) {
      this.position.x = Constants.canvas.width - 115 * this.props.scale;
    }
    this.draw();
  }

  public goRight() {
    this.direction = "right";
    this.velocity.x = 5;
  }

  public goLeft() {
    this.direction = "left";
    this.velocity.x = -5;
  }
  public jump() {
    if (this.isJumping) return;
    this.velocity.y = -20;
  }

  public stopHorizontal() {
    this.action = "idle";
    this.props.frames = 8;
    this.velocity.x = 0;
  }

  public async attack(other: Fighter): Promise<boolean> {
    if (this.isAttacking) return false;

    this.attackType = Math.random() > 0.5 ? 1 : 2;
    this.currentFrame = 3; //  No idea why `3` works !!!, but oh well
    this.framesElapsed = 3; // Future me, I spent 15mins trying to fix this. Proceed at your own risk lol
    this.isAttacking = true;

    const attackPromise: Promise<boolean> = new Promise((resolve) => {
      setTimeout(() => {
        this.isAttacking = false;
        if (!this.canAttack(other)) {
          resolve(false);
          return;
        }

        other.health -= Math.ceil(Math.random() * 5);
        if (other.health <= 0) {
          other.health = 0;
        }
        resolve(true);
      }, 1000 / Constants.actionFrameCount[this.props.type][`attack${this.attackType}`]);
    });
    return await attackPromise;
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

  public gotAttacked() {
    this.takingHit = true;
    if (this.health === 0) {
      this.action = "death";
      this.currentFrame = 0;
      this.framesElapsed = 1;
      this.isDying = true;
    }
  }
}
