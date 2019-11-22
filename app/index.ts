import { Canvas } from './services/canvas';
import { PathDrawer } from './services/path.drawer';
import { ShapeDrawer } from './services/shape.drawer';
import { PickDrawer } from './services/pick.drawer';

const years = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];
const canvas = new Canvas(document.all['canvas']);
const shaper = new ShapeDrawer(canvas);
new PathDrawer(canvas, shaper).drawPath().then(({lineCords}) => {
  console.log(new PickDrawer(shaper, lineCords.slice(20, lineCords.length - 10), years).drawPicks());
});

