interface AnimateOpts {
  duration: number
  draw: (t: number) => void
  timing: (t: number) => number
  onDone?: () => void
}

interface RepeatOpts {
  draw: () => void,
  until: { done: boolean }
  fps?: number
  onDone?: () => void
}

export function animate({timing, draw, duration, onDone}: AnimateOpts) {
  const start = performance.now();

  requestAnimationFrame(function doCycle(time) {
    let _time = start > time ? start : time;
    let timeFraction = (_time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    const progress = timing(timeFraction);
    draw(progress);

    if (timeFraction < 1) {
      return requestAnimationFrame(doCycle);
    }

    if (typeof onDone === 'function') {
      onDone()
    }
  });
}

export function repeat({fps, draw, until, onDone}: RepeatOpts) {
  let prevCheck = performance.now();
  const temp = 1000 / (fps || 1000);

  requestAnimationFrame(function doCycle(time){
    if (prevCheck + temp > time) {
      return requestAnimationFrame(doCycle)
    }

    prevCheck = time;
    draw();

    if (!until.done) {
      return requestAnimationFrame(doCycle)
    }

    if (typeof onDone === 'function') {
      onDone()
    }
  });

}
