import { ICords } from '../models/basic';
import { ShapeService } from '../services/shape.service';
import { animate } from '../utils/animate';
import { Timing } from '../utils/timing';
import { COLORS } from '../configs/colors';
import { HoverService } from '../services/hover.service';
import { mainOpts } from '../configs/main';
import linear = Timing.linear;
import easeInOutQuint = Timing.easeInOutQuint;
import easeInCubic = Timing.easeInCubic;
import { ClickService } from '../services/click.service';

export interface PeakOpts extends ICords {
  label: number
}

export class PeakDrawer {
  private peakRadius = 20;
  private delayRatio = 150;

  public readonly peakCords: PeakOpts[] = [];
  private active: PeakOpts;
  private clickHandlers = [];
  private hoverHandlers = [];

  private get partsAmount(): number {
    if (this.labels.length < 2) return 2;
    return this.labels.length
  }

  private get dotsSkipped(): number {
    return Math.floor(this.pathCords.length / this.partsAmount)
  }

  constructor(
    private shaper: ShapeService,
    private pathCords: ICords[],
    private labels: number[] = [new Date().getFullYear()],
    private hoverService: HoverService,
    private clickService: ClickService
  ) {
  }

  resolve(): Promise<PeakDrawer> {
    return new Promise(resolve => {
      for (let i = 0; i < this.labels.length; i++) {
        const opts = this.computeCords(i);
        this.peakCords.push(opts);
        this.drawPeakWithDelay(opts, i,this.delayRatio * i);
      }

      setTimeout(() => resolve(this), this.delayRatio * this.labels.length);
    });


  }

  setActive(index: number) {
    this.peakCords.forEach(p => {
      this.shaper.drawDot(p.x, p.y, this.peakRadius, COLORS.peak);
    });

    const active = this.peakCords[index];
    if (!active) {
      return console.warn('not exist');
    }

    this.active = active;
    this.shaper.drawDot(active.x, active.y, this.peakRadius, COLORS.red)
  }

  onClick(handler: (i, year) => void) {
    this.clickHandlers.push(handler);
  }

  destroy() {
    this.hoverHandlers.forEach(h => this.hoverService.removeHandler(h));
    this.clickHandlers.forEach(h => this.clickService.removeHandler(h))

    this.hoverHandlers = [];
    this.clickHandlers = [];
  }

  private drawPeakWithDelay(opts: PeakOpts, index: number, delay = 0) {
    setTimeout(() => this.drawPeak(opts, index), delay)
  }

  private drawPeak(peak: PeakOpts, index: number) {
    animate({
      draw: progress => this.shaper.drawDot(peak.x, peak.y, this.peakRadius * progress, COLORS.peak),
      duration: 600,
      timing: easeInOutQuint,
      onDone: () => {
        this.drawLabel(peak);
        this.addHover(peak);
        this.addClick(peak, index)
      }
    })
  }

  private addHover(peak: PeakOpts) {
    const {x, y} = peak;

    const handler = (hovered) => {
      if (peak === this.active) {
        return this.shaper.drawDot(x, y, this.peakRadius, COLORS.red)
      }

      if (hovered) {
        return animate({
          draw: t => this.shaper.drawDot(x, y, t * this.peakRadius, COLORS.dot),
          duration: 300,
          timing: easeInCubic
        });
      }

      animate({
        draw: t => this.shaper.drawDot(x, y, t * this.peakRadius, COLORS.peak),
        duration: 300,
        timing: easeInCubic
      });
    };
    this.hoverHandlers.push(handler);

    this.hoverService.addHandler([{
      area: this.computeClickArea(peak),
      handler
    }])
  }

  private addClick(peak: PeakOpts, index: number) {
    this.clickService.addHandler([{
      area: this.computeClickArea(peak),
      handler: (clicked) => {
        if (clicked) {
          this.clickHandlers.forEach(h => h(index, peak.label))
        }
      }
    }])
  }

  private computeClickArea({x, y}: ICords) {
    return {
      x0: (x - this.peakRadius - HoverService.padding) / mainOpts.dpiMultiplier,
      x1: (x + this.peakRadius + HoverService.padding) / mainOpts.dpiMultiplier,
      y0: (y - this.peakRadius - HoverService.padding) / mainOpts.dpiMultiplier,
      y1: (y + this.peakRadius + HoverService.padding) / mainOpts.dpiMultiplier
    }
  }

  private drawLabel({x, y, label}: PeakOpts) {
    animate({
      timing: linear,
      duration: 100,
      draw: progress => this.shaper.drawText(
        x - 35,
        y + 50,
        `${label}`,
        `${30 * progress}px Arial`,
        COLORS.text,
        COLORS.white
      )
    })
  }

  private computeCords(index: number) {
    const _opts: PeakOpts = this.pathCords[(index + 1) * this.dotsSkipped] as any;
    _opts.label = this.labels[index];

    return _opts
  }
}
