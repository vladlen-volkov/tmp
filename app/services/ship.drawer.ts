import { ShapeDrawer } from './shape.drawer';
import { ICords } from '../models/basic';
import { COLORS } from '../configs/colors';
import { Canvas } from './canvas';
import { repeat } from '../utils/animate';

const inaccuracy = 1;

export class ShipDrawer {
  private currentPeak = -1;
  private image = new Image();
  private currDotCord: ICords;
  private width = 120; // picture's width according to canvas-scaling
  private height = 60; // picture's height according to canvas-scaling
  private xOffset = this.width * 0.8;
  private yOffset = this.height + 30; // 20 is a margin from bottom;
  private rotate = 0;
  private rotateInaccuracy = 33; // this is a magic number getting in experiments (using in getter cords);

  private get cords(): ICords {
    const dotCord = this.currDotCord;
    return {
      y: dotCord.y - this.yOffset - (this.rotate + this.rotateInaccuracy) / 3, // equation getting by experiments
      x: dotCord.x - this.xOffset + (this.rotate / 2) + this.rotateInaccuracy // equation getting by experiments
    }
  }

  constructor(
    private shaper: ShapeDrawer,
    private pathCords: ICords[],
    private pickCords: ICords[],
    private canvas: Canvas
  ) {
    this.currDotCord = this.pathCords[20];
    this.rotate = this.computeAngle(this.currDotCord, this.pathCords[21]);

    (document.all['next'] as HTMLButtonElement).addEventListener('click', () => {
      this.moveToPeak(this.currentPeak + 1);
    });
    (document.all['prev'] as HTMLButtonElement).addEventListener('click', () => {
      this.moveToPeak(this.currentPeak - 1)
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
    this.move();
    this.moveToPeak(0);
    //this.moveAccordingToPath(10, 160)
  }

  moveToPeak(i: number) {
    const peak = this.pickCords[i];
    if (!peak) {
      return console.warn(`no pick with index {${i}}`);
    }

    const direction = this.currentPeak < i; // true means next; false means prev
    const until = {done: false};

    repeat({
      until,
      fps: 50,
      draw: () => {
        until.done = this.currDotCord === peak;
        if (!until.done) {
          if (direction) {
            return this.nextCord()
          }

          this.prevCord();
        }
      },
      onDone: () => {
        this.currentPeak = i;
      }
    })
  }

  private nextCord() {
    this.clean();
    const i = this.pathCords.findIndex(c => c === this.currDotCord);
    const next = this.pathCords[i + 1];
    this.rotate = this.computeAngle(this.currDotCord, next);
    this.currDotCord = next;
    this.move();
  }

  private prevCord() {

    this.clean();
    const i = this.pathCords.findIndex(c => c === this.currDotCord);
    const prev = this.pathCords[i - 1];
    this.rotate = this.computeAngle(this.currDotCord, prev);
    this.currDotCord = prev;
    this.move();
  }

  private computeAngle(from: ICords, to: ICords) {
    const { cathetY, cathetX, rotateDirection } = this.computeTrangleAndDirection(from ,to);
    const gyp = Math.sqrt(Math.pow(cathetX, 2) + Math.pow(cathetY, 2));
    const sin = cathetY / gyp;
    const rads = Math.asin(sin) * rotateDirection;
    return -Math.ceil((rads / ShapeDrawer.radienMulti))
  }

  private computeTrangleAndDirection(from: ICords, to: ICords) {
    const xDelta = from.x - to.x;
    const yDelta = from.y - to.y;
    const cathetX = Math.abs(xDelta);
    const cathetY = Math.abs(yDelta);
    const shouldChangeRotateDir = (xDelta < 0 && yDelta > 0) || (xDelta > 0 && yDelta < 0);

    return {
      cathetX,
      cathetY,
      rotateDirection: shouldChangeRotateDir ? 1 : -1 // 1 is means that real peak of triangle tend to top, -1 means that real peak tends to bottom
    }
  }

  private move() {
    this.shaper.drawImage(this.cords.x, this.cords.y, this.image, this.width, this.height, null, this.rotate)
  }

  private clean() {
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
