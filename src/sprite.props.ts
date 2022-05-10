import { XY } from "./position.js";

export interface SpriteProps {
  position: XY;
  size: XY;
  imgSrc: string;
  frames: number;
  scale: number;
}
