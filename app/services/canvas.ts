export class Canvas {
  readonly ctx: CanvasRenderingContext2D;

  constructor (private canvasElem: HTMLCanvasElement) {
    this.canvasElem.height = 900; // this height 400x2 (400 ===  viewbox-image in particular task)
    this.canvasElem.width = 2500; // this height 1250x2 (1250 === viewbox-image in particular task)

    this.ctx = this.canvasElem.getContext('2d');
    (this.ctx as any).mozImageSmoothingEnabled = false;
    (this.ctx as any).webkitImageSmoothingEnabled = false;
    (this.ctx as any).msImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  }

  get height (): number {
    return this.canvasElem.height
  }

  get width () {
    return this.canvasElem.width
  }
}
