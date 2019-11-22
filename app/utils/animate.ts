import { strict } from 'assert';

interface AnimateOpts {
  duration: number
  draw: (t: number) => void
  timing: (t: number) => number
  onDone?: () => void
}

interface RepeatOpts {
  draw: (args?: any) => void
  until: { done: boolean }
}

export function animate({timing, draw, duration, onDone}: AnimateOpts) {
  const start = performance.now();

  requestAnimationFrame(function animate(time) {
    let _time = start > time ? start : time;
    let timeFraction = (_time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    const progress = timing(timeFraction);
    draw(progress);

    if (timeFraction < 1) {
      return requestAnimationFrame(animate);
    }

    if (typeof onDone === 'function') {
      onDone()
    }
  });
}

export function repeat(params: RepeatOpts) {
  requestAnimationFrame(() => {
    params.draw();
    if (!params.until.done) {
      repeat(params)
    }
  });

}
