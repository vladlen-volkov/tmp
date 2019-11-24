import { Canvas } from '../services/canvas';
import { ShapeService } from '../services/shape.service';
import { repeat } from '../utils/animate';
import { ICords } from '../models/basic';

export class PathDrawer {
  private dotRadius = 2;
  private xRatio = 0;
  private yRatio = 1;
  private sinRatio = 70;
  private yRatioMultiplier = 4.2;
  private xRatioMultiplier = 142;
  private xOffset = -120;
  private until = {done: false};

  lineCords: ICords[] = [];

  private get centerOfNewDot(): ICords {
    return {
      y: this.canvas.height + this.sinRatio * Math.sin(this.xRatio) + (--this.yRatio * this.yRatioMultiplier),
      x: this.xRatio * this.xRatioMultiplier + this.xOffset
    }
  }

  constructor(
    private canvas: Canvas,
    private shapeDrawer: ShapeService
  ) {
  }

  resolve(): Promise<PathDrawer> {
    return new Promise(resolve => {
      repeat({
        until: this.until,
        draw: () => this.drawPath(resolve)
      });
    });
  }

  destroy() {
    this.until.done = true;
  }

  private drawPath(onDone) {
    const center = this.centerOfNewDot;
    this.drawDot(center);
    this.lineCords.push(center);

    this.until.done = center.x >= this.canvas.width;
    if (this.until.done) {
      onDone(this);
    }
  }

  private drawDot(center: ICords) {
    this.shapeDrawer.drawDot(center.x, center.y, this.dotRadius);
    this.xRatio += 0.1; // simple factor got by experemental running
  }
}


