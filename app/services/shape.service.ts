import { getPercentOf } from '../utils/numeric';
import { COLORS } from '../configs/colors';
import { ICords } from '../models/basic';

export class ShapeService {
  static fullAngle = 2 * Math.PI;
  static radianMulti = Math.PI / 180;

  constructor(private ctx: CanvasRenderingContext2D) {
  }

  drawDot(x, y, radius, color = COLORS.dot) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, ShapeService.fullAngle);
    this.ctx.fillStyle = color;
    this.ctx.fill()
  }

  drawText(x, y, text, fontStyle = '30px Arial', color = COLORS.text, bgColor: COLORS | null = COLORS.white) {

    if (bgColor !== null) {
      const textWidth = this.ctx.measureText(text).width;
      const textHeight = parseInt(fontStyle, 10);
      const padding = Math.floor(getPercentOf(textHeight, 20));
      const wrapWidth = textWidth + padding * 2;
      const wrapHeight = textHeight + padding * 2;
      const wrapX = x - padding;
      const wrapY = y - padding;

      this.drawRect(wrapX, wrapY, wrapWidth, wrapHeight, bgColor);
    }


    this.ctx.font = fontStyle;
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  drawRect(x, y, width, height, bgColor = COLORS.dot, degree?: number) {
    this.ctx.beginPath();
    this.saveRestoreCtx(() => {
      this.rotate(degree, {
        x: x + getPercentOf(width, 50),
        y: y + getPercentOf(height, 50)
      });
      this.ctx.rect(x, y, width, height);
      this.ctx.fillStyle = bgColor;
      this.ctx.fill()
    })

  }

  drawImage(x, y, img: HTMLImageElement, width, height, bgColor: COLORS | null = COLORS.white, degree?: number) {
    this.ctx.beginPath();

    this.saveRestoreCtx(() => {
      this.rotate(degree, {
        x: x + getPercentOf(width, 50),
        y: y + getPercentOf(height, 50)
      });
      if (bgColor !== null) {
        this.drawRect(x, y, width, height, bgColor)
      }

      this.ctx.drawImage(img, x, y, width, height);
    });
  }

  saveRestoreCtx(fn: Function) {
    this.ctx.save();
    fn();
    this.ctx.restore();
  }

  private rotate(degree: number, center: ICords) {
    if (degree && degree !== 0) {
      const {x, y} = center;
      this.ctx.translate(x, y);
      const rads = degree * ShapeService.radianMulti;
      this.ctx.rotate(rads);
      this.ctx.translate(-x, -y)
    }
  }
}
