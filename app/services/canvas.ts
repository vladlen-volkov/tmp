import { mainOpts } from '../configs/main';

export class Canvas {
  readonly ctx: CanvasRenderingContext2D;

  get width () {
    return this.el.width
  }

  get height (): number {
    return this.el.height
  }

  constructor (public el: HTMLCanvasElement) {
    this.el.height = 450 * mainOpts.dpiMultiplier; // this height 400x2 (400 ===  viewbox-image in particular task)
    this.el.width = 1250 * mainOpts.dpiMultiplier; // this height 1250x2 (1250 === viewbox-image in particular task)

    this.ctx = this.el.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  }
}
