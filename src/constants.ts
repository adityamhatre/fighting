export class Constants {
  static readonly canvas = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;
  static readonly c = Constants.canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  static readonly width = 1366;
  static readonly height = 768;

  static readonly ground = 660;
  static readonly actionFrameCount = {
    player: {
      idle: 8,
      fall: 2,
      jump: 2,
      attack1: 6,
      attack2: 6,
      run: 8,
      takeHit: 4,
      death: 6,
    },
    enemy: {
      idle: 4,
      fall: 2,
      jump: 2,
      attack1: 4,
      attack2: 4,
      run: 8,
      takeHit: 3,
      death: 7,
    },
  };

  static gameTimer = 150;
}
