import { ShapeDrawer } from './shape.drawer';
import { ICords } from '../models/basic';

export class ShipDrawer {
  constructor (
    private shaper: ShapeDrawer,
    private pathCords: ICords[],
    private pickCords: ICords[]
  ) {

  }
}
