import { Canvas } from './canvas';
import { getPercentOf } from '../utils/numeric';
import { COLORS } from '../configs/colors';

export class ShapeDrawer {
  private static fullAngle = 2 * Math.PI;
  constructor(private canvas: Canvas) {}

  drawDot(x, y, radius, color = COLORS.dot) {
    const { ctx } = this.canvas;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, ShapeDrawer.fullAngle);
    ctx.fillStyle = color;
    ctx.fill()
  }

  drawText(x, y, value: string, fontStyle: string = "30px Arial", color = COLORS.text, bgColor = COLORS.white) {
    const { ctx } = this.canvas;
    const textWidth = ctx.measureText(value).width;
    const textHeight = parseInt(fontStyle, 10);
    const padding = Math.floor(getPercentOf(textHeight, 20));
    const wrapWidth = textWidth + padding * 2;
    const wrapHeight = textHeight + padding * 2;
    const wrapX = x - padding;
    const wrapY = y - padding;

    this.drawRect(wrapX, wrapY, wrapWidth, wrapHeight, bgColor);

    ctx.font = fontStyle;
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  }

  drawRect(x, y, width, height, bgColor = COLORS.dot) {
    const { ctx } = this.canvas;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = bgColor;
    ctx.fill()
  }

  drawImage(x, y) {

  }
}
