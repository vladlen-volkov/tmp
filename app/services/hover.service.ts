import { MouseEventService } from './base/events';

interface HoverHandler {
  area: { x0, x1, y0, y1 },
  handler: (hovered: boolean, evt: MouseEvent) => void
}

export class HoverService extends MouseEventService{
  constructor(canvasEl: HTMLCanvasElement) {
    super(canvasEl, 'mousemove')
  }


}
