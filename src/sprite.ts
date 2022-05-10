import { Constants } from "./constants.js";
import { XY } from "./position.js";
import { SpriteProps } from "./sprite.props.js";

export class Sprite {
  private image = new Image();
  private props: SpriteProps;
  private position: XY;
  private framesElapsed = 0;
  private holdFrame = 5;
  private currentFrame = 0;
  constructor(props: SpriteProps) {
    this.props = props;
    this.position = props.position;
    this.image.src = props.imgSrc;
    this.image.onload = () => {};
  }

  private draw() {
    if (this.framesElapsed++ % this.holdFrame == 0) {
      if (++this.currentFrame >= this.props.frames) {
        this.currentFrame = 0;
      }
      this.framesElapsed = 1;
    }

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

  public update() {
    this.draw();
  }
}
