import { ShapeService } from '../services/shape.service';
import { ICords } from '../models/basic';
import { COLORS } from '../configs/colors';

export class TestOfDrawingDrawer {
  private width = 120; // picture's width according to canvas-scaling
  private height = 60; // picture's height according to canvas-scaling
  private cords: ICords = {x: 0, y: 300};
  private rotate = 0;

  constructor(
    private shaper: ShapeService
  ) {}

  private image = new Image();

  downloadImage(): Promise<TestOfDrawingDrawer> {
    return new Promise(resolve => {
      this.image.onload = () => {
        this.move({
          y: 300,
          x: 0
        });
        resolve(this);
        this.image.onload = null
      };
      this.image.src = './ship.png'
    });
  }

  move(cords: ICords, rotate = 0) {
    this.clean();
    this.shaper.drawImage(cords.x, cords.y, this.image, this.width, this.height, COLORS.white, rotate);
    this.cords = cords;
    this.rotate = rotate
  }

  private clean() {
    const inaccuracy = 1;
    this.shaper.drawRect(
      this.cords.x - inaccuracy,
      this.cords.y - inaccuracy,
      this.width + 2 * inaccuracy,
      this.height + 2 * inaccuracy,
      COLORS.white,
      this.rotate
    );
  }
}
