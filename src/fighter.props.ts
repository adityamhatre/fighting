import { XY } from "./position.js";

export interface FighterProps {
  position: XY;
  velocity: XY;
  color: string;
  size: XY;
  imgSrc: string;
  frames: number;
  scale: number;
  direction: "left" | "right";
  type: "player" | "enemy";
  hitBoxOffset: { position: XY; size: { width: number; height: number } };
}
