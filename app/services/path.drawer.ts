import { Canvas } from './canvas';
import { ShapeDrawer } from './shape.drawer';
import { repeat } from '../utils/animate';
import { ICords } from '../models/basic';

export class PathDrawer {
  private xRatio = 0;
  private yRatio = 1;
  private sinRatio = 70;
  private yRatioMultiplier = 4.2;
  private xRatioMultiplier = 142;
  private xOffset = -120;
  lineCords: ICords[] = [];

  constructor(
    private canvas: Canvas,
    private shapeDrawer: ShapeDrawer
  ) {
  }

  drawPath(): Promise<PathDrawer> {
    return new Promise(resolve => {
      const until = {done: false};
      repeat({
        draw: () => {
          const centerOfNewDot = this.computeNextCords();
          this.lineCords.push(centerOfNewDot);

          const {x, y} = centerOfNewDot;
          this.drawDot(x, y);
          until.done = x >= this.canvas.width;

          if (until.done) {
            resolve(this);
          }
        },
        until
      });
    });
  }

  private drawDot(x: number, y: number) {
    this.shapeDrawer.drawDot(x, y, 2);
    this.xRatio += 0.1; /** simple factor got by experemental running*/;
  }

  private computeNextCords(): {x: number, y: number} {
    return {
      y: this.canvas.height + this.sinRatio * Math.sin(this.xRatio) + (--this.yRatio * this.yRatioMultiplier),
      x: this.xRatio * this.xRatioMultiplier + this.xOffset
    }
  }
}


