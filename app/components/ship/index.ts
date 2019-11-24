import { ShapeService } from '../../services/shape.service';
import { ICords } from '../../models/basic';
import { COLORS } from '../../configs/colors';
import { repeat } from '../../utils/animate';
import { MotionComputer } from './helpers/motion.computer';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { getPercentOf } from '../../utils/numeric';

const inaccuracy = 1; // simple padding in clean area
const rotateInaccuracy = 33; // this is a "magic" number getting in experiments with ship moving (using in getter cords);

export class ShipComponent {
  private motion: MotionComputer;
  private startDot = 20;
  private currentPeak = -1;
  private image = new Image();
  private width = 120; // picture's width according to canvas-scaling
  private height = 60; // picture's height according to canvas-scaling
  private xOffset = getPercentOf(this.width, 80);
  private yOffset = this.height + 30; // 30 is a margin from bottom;

  private get cords(): ICords {
    const dotCord = this.motion.currDotCord;
    return {
      y: dotCord.y - this.yOffset - (this.motion.rotate + rotateInaccuracy) / 3, // equation getting by experiments
      x: dotCord.x - this.xOffset + (this.motion.rotate / 2) + rotateInaccuracy // equation getting by experiments
    }
  }

  constructor(
    private shaper: ShapeService,
    private pathCords: ICords[],
    private peakCords: ICords[]
  ) {
    this.motion = new MotionComputer(this.pathCords, this.startDot);

    (document.all['next'] as HTMLButtonElement).addEventListener('click', () => {
      this.moveToPeak(this.currentPeak + 1);
    });
    (document.all['prev'] as HTMLButtonElement).addEventListener('click', () => {
      this.moveToPeak(this.currentPeak - 1)
    });

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 37) {
        //return this.prevCord()
      }

      if (e.keyCode === 39) {
        //return this.nextCord()
      }
    })
  }

  downloadImage(url = './ship.png'): Promise<ShipComponent> {
    return resolveImageUrl(this.image, url).then(() => this)
  }

  appearance() {
    return new Promise(resolve => this.moveToPeak(0, resolve));
  }

  moveToPeak(i: number, onDone?: (currPeak) => void) {
    const peak = this.peakCords[i];
    if (!peak) {
      return console.warn(`no pick with index {${i}}`);
    }

    const direction = this.currentPeak < i; // true means next; false means prev
    const until = {done: false};

    repeat({
      until,
      fps: 50,
      draw: () => {
        until.done = this.motion.currDotCord === peak;
        if (!until.done) {
          if (direction) {
            return this.moveNextCord()
          }

          this.movePrevCord();
        }
      },
      onDone: () => {
        this.currentPeak = i;
        if (typeof onDone === 'function') onDone(this.currentPeak);
      }
    })
  }

  private moveNextCord() {
    this.clean();
    this.motion.computeNextCord();
    this.move();
  }

  private movePrevCord() {
    this.clean();
    this.motion.computePrevCord();
    this.move();
  }

  private move() {
    this.shaper.drawImage(this.cords.x, this.cords.y, this.image, this.width, this.height, null, this.motion.rotate)
  }

  private clean() {
    this.shaper.drawRect(
      this.cords.x - inaccuracy,
      this.cords.y - inaccuracy,
      this.width + 2 * inaccuracy,
      this.height + 2 * inaccuracy,
      COLORS.white,
      this.motion.rotate
    );
  }


}
