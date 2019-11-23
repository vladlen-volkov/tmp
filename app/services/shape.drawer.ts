import { Canvas } from './canvas';
import { getPercentOf } from '../utils/numeric';
import { COLORS } from '../configs/colors';
import { ICords } from '../models/basic';

export class ShapeDrawer {
  static fullAngle = 2 * Math.PI;
  static radienMulti = Math.PI / 180;

  constructor(private canvas: Canvas) {
  }

  drawDot(x, y, radius, color = COLORS.dot) {
    const {ctx} = this.canvas;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, ShapeDrawer.fullAngle);
    ctx.fillStyle = color;
    ctx.fill()
  }

  drawText(x, y, text, fontStyle = '30px Arial', color = COLORS.text, bgColor: COLORS | null = COLORS.white) {
    const {ctx} = this.canvas;

    if (bgColor !== null) {
      const textWidth = ctx.measureText(text).width;
      const textHeight = parseInt(fontStyle, 10);
      const padding = Math.floor(getPercentOf(textHeight, 20));
      const wrapWidth = textWidth + padding * 2;
      const wrapHeight = textHeight + padding * 2;
      const wrapX = x - padding;
      const wrapY = y - padding;

      this.drawRect(wrapX, wrapY, wrapWidth, wrapHeight, bgColor);
    }


    ctx.font = fontStyle;
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  drawRect(x, y, width, height, bgColor = COLORS.dot, degree?: number) {
    const {ctx} = this.canvas;
    ctx.beginPath();
    this.saveRestoreCtx(() => {
      this.rotate(degree, {
        x: x + getPercentOf(width, 50),
        y: y + getPercentOf(height, 50)
      });
      ctx.rect(x, y, width, height);
      ctx.fillStyle = bgColor;
      ctx.fill()
    })

  }

  private rotate(degree: number, center: ICords) {
    if (degree && degree !== 0) {
      const {x, y} = center;
      this.canvas.ctx.translate(x, y);
      const rads = degree * ShapeDrawer.radienMulti;
      this.canvas.ctx.rotate(rads);
      this.canvas.ctx.translate(-x, -y)
    }
  }

  drawImage(x, y, img: HTMLImageElement, width, height, bgColor: COLORS | null = COLORS.white, degree?: number) {
    const {ctx} = this.canvas;
    ctx.beginPath();

    this.saveRestoreCtx(() => {
      this.rotate(degree, {
        x: x + getPercentOf(width, 50),
        y: y + getPercentOf(height, 50)
      });
      if (bgColor !== null) {
        this.drawRect(x, y, width, height, bgColor)
      }
      //this.drawRect(x, y, width, height, COLORS.pick)
      ctx.drawImage(img, x, y, width, height);
    });
  }

  saveRestoreCtx(fn: Function) {
    const {ctx} = this.canvas;
    ctx.save();
    fn();
    ctx.restore();
  }
}
