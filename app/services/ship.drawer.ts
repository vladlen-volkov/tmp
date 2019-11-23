import { ShapeDrawer } from './shape.drawer';
import { ICords } from '../models/basic';
import { COLORS } from '../configs/colors';
import { Timing } from '../utils/timing';
import { Canvas } from './canvas';

const inaccuracy = 1;

export class ShipDrawer {
  private image = new Image();
  // private cords: ICords;
  private currDotCord: ICords;
  private width = 120; // picture's width according to canvas-scaling
  private height = 60; // picture's height according to canvas-scaling
  private xOffset = this.width * 0.8;
  private yOffset = this.height + 20; // 20 is a margin from bottom;
  private rotate = 0;

  private get cords(): ICords {
    const dotCord = this.currDotCord;
    return {
      y: dotCord.y - this.yOffset,
      x: dotCord.x - this.xOffset
    }
  }

  constructor(
    private shaper: ShapeDrawer,
    private pathCords: ICords[],
    private pickCords: ICords[],
    private canvas: Canvas
  ) {
    this.currDotCord = this.pickCords[0];
    this.rotate = this.computeAngle(this.currDotCord, this.pathCords[40]);
    console.log('rotate: ',this.rotate);

    (document.all['next'] as HTMLButtonElement).addEventListener('click', () => {
      this.nextCord()
    });
    (document.all['prev'] as HTMLButtonElement).addEventListener('click', () => {
      this.prevCord()
    });

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 37) {
        return this.prevCord()
      }

      if (e.keyCode === 39) {
        return this.nextCord()
      }
    })

  }

  downloadImage(): Promise<ShipDrawer> {
    return new Promise(resolve => {
      this.image.onload = () => {
        resolve(this);
        this.image.onload = null
      };
      this.image.src = './ship.png'
    });
  }

  appearance() {
    this.move(this.rotate)
    //this.moveAccordingToPath(10, 160)
  }

  nextCord() {
    this.clean();
    const i = this.pathCords.findIndex(c => c === this.currDotCord);
    console.log(i);
    const next = this.pathCords[i+1];
    const rotate = this.computeAngle(this.currDotCord, next);
    this.currDotCord = next;
    this.move(rotate);
  }

  prevCord() {

    this.clean();
    const i = this.pathCords.findIndex(c => c === this.currDotCord);
    console.log(i);
    const prev = this.pathCords[i-1];
    const rotate = this.computeAngle(this.currDotCord, prev);
    this.currDotCord = prev;
    this.move(rotate);
  }

  // moveAccordingToPath(i, z) {
  //   const until = {done: false};
  //   let _i = i;
  //   let m: boolean;
  //   repeat({
  //     until,
  //     draw: () => {
  //       m = !m;
  //       if (!m) return;
  //       _i++;
  //       const cord = this.pathCords[_i];
  //
  //       // const t = this.pathCords[_i - 1].y - this.pathCords[_i].y;
  //       // this.shaper.drawDot(cord.x, cord.y, 2,  t>0 ? COLORS.text: COLORS.red);
  //       // console.log(t)
  //       const next = {
  //         x: cord.x,
  //         y: cord.y
  //       };
  //       // this.canvas.ctx.beginPath();
  //       // this.canvas.ctx.moveTo(next.x, next.y);
  //       // this.canvas.ctx.lineTo(cord.x, cord.y);
  //       // this.canvas.ctx.lineWidth = 2; // толщина линии
  //       // this.canvas.ctx.strokeStyle = "#ff0000"; // цвет линии
  //       // this.canvas.ctx.stroke();
  //       const rotate = this.computeAngle(this.cords, next);
  //       this.move(next, rotate);
  //       until.done = _i === z;
  //     }
  //   })
  // }

  computeAngle(from: ICords, to: ICords) {
    const cathetX = Math.abs(from.x - to.x);
    const cathetY = Math.abs(from.y - to.y);

    const gyp = Math.sqrt(Math.pow(cathetX, 2) + Math.pow(cathetY, 2));
    const sin = cathetY / gyp;
    const rads = Math.asin(sin);
    const result = -(rads / ShapeDrawer.radienMulti);
    console.log('rotate', result);
    return -(rads / ShapeDrawer.radienMulti)
  }



  private move(rotate = 0) {
    // this.clean();
    console.log(rotate);
    this.shaper.drawDot(this.currDotCord.x, this.currDotCord.y, 4, COLORS.red)
    this.shaper.drawImage(this.cords.x, this.cords.y, this.image, this.width, this.height, null, rotate)
  }

  private clean() {
    console.log(this.rotate);
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
