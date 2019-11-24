interface HoverHandler {
  area: { x0, x1, y0, y1 },
  handler: (hovered: boolean, evt: MouseEvent) => void
}

export abstract class MouseEventService {
  protected handlers: HoverHandler[] = [];
  private isAnyHovered: boolean;

  protected constructor(
    private canvasEl: HTMLCanvasElement,
    private evt: keyof GlobalEventHandlersEventMap
  ) {
    this.canvasEl.addEventListener(evt as any, this.callback)
  }

  addHandler(handlers: HoverHandler[]) {
    this.handlers = [...this.handlers, ...handlers];
  }

  removeHandler(handler: HoverHandler) {
    this.handlers = this.handlers.filter(h => h === handler);
  }

  removeAllHandlers() {
    this.handlers = [];
  }

  destroy() {
    this.removeAllHandlers();
    this.canvasEl.removeEventListener(this.evt as any, this.callback)
  }

  private callback = (e: MouseEvent) => {
    const {left, top} = this.canvasEl.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    for (let i = 0; i < this.handlers.length; i++) {
      const {area, handler} = this.handlers[i];
      const hovered = this.checkAreaHovered(area, x, y);
      if (hovered) this.isAnyHovered = true;

      handler(hovered, e);
    }

    if (this.isAnyHovered) {
      this.canvasEl.style.cursor = 'pointer';
      this.isAnyHovered = false
    } else {
      this.canvasEl.style.cursor = 'default';
    }
  };

  private checkAreaHovered(area: HoverHandler['area'], x: number, y: number) {
    return (area.x0 <= x && area.x1 >= x) && (area.y0 <= y && area.y1 >= y)
  }


  static padding = 20;
}
