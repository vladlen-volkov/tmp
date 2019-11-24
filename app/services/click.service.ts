import { MouseEventService } from './base/events';

export class ClickService extends MouseEventService {
  constructor(el: HTMLCanvasElement) {
    super(el, 'click');
  }
}
