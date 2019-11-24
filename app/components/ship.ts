import { Canvas } from '../services/canvas';
import { ShipDrawer } from '../services/ship.drawer';

export class Ship {
  constructor(
    private canvas: Canvas,
    private shipService: ShipDrawer
  ) {}
}
