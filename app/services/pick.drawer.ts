import { ICords } from '../models/basic';
import { ShapeDrawer } from './shape.drawer';
import { animate } from '../utils/animate';
import { Timing } from '../utils/timing';
import easeInOutQuint = Timing.easeInOutQuint;
import linear = Timing.linear;
import { COLORS } from '../configs/colors';

export interface PickOpts extends ICords{
  year: number
}

export class PickDrawer {
  private delayRatio = 150;
  public readonly pickCords: PickOpts[] = [];

  private get partsAmount (): number {
    if (this.years.length < 2) return 2;
    return this.years.length
  }

  private get dotsSkipped (): number {
    return Math.floor(this.pathCords.length / this.partsAmount)
  }

  constructor(
    private shapeDrawer: ShapeDrawer,
    private pathCords: ICords[],
    private years: number[] = []
  ) {}

  drawPicks() {
    for (let i = 0; i < this.years.length; i++) {
      const opts = this.computeCords(i);
      this.pickCords.push(opts);
      this.drawPickWithDelay(opts, this.delayRatio * i);
    }

    return this.pickCords

  }

  private drawPickWithDelay(opts: PickOpts, delay = 0) {
    setTimeout(() => this.drawPick(opts), delay)
  }

  private drawPick({ y, x, year }: PickOpts) {
    animate({
      draw: progress => this.shapeDrawer.drawDot(x, y, 20 * progress, COLORS.pick),
      duration: 800,
      timing: easeInOutQuint,
      onDone: () => this.drawYear(x, y, year)
    })
  }

  private drawYear(x: number, y: number, year: number) {
    animate({
      timing: linear,
      duration: 100,
      draw: progress => this.shapeDrawer.drawText(
        x - 35,
        y + 50,
        `${year}`,
        `${30 * progress}px Arial`,
        COLORS.text,
        COLORS.white
      )
    })
  }

  private computeCords(index: number) {
    const _opts: PickOpts = this.pathCords[(index + 1) * this.dotsSkipped] as any;
    _opts.year = this.years[index];

    return _opts
  }
}
