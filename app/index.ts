import { Canvas } from './services/canvas';
import { PathDrawer } from './services/path.drawer';
import { ShapeDrawer } from './services/shape.drawer';
import { PickDrawer } from './services/pick.drawer';
import { ShipDrawer } from './services/ship.drawer';
import { TestImageDrawer } from './services/test.image.drawer';
import { animate } from './utils/animate';
import { Timing } from './utils/timing';
import linear = Timing.linear;

const years = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];
const canvas = new Canvas(document.all['canvas']);
const shaper = new ShapeDrawer(canvas);

// new TestImageDrawer(shaper).downloadImage().then(t => {
//   animate({
//     draw: p => {
//       t.move({
//         y:300,
//         x: p*1000
//       }, 360*p)
//     },
//     timing: linear,
//     duration: 2000
//   })
// })

new PathDrawer(canvas, shaper).drawPath().then(({lineCords}) => {
  const pickCords = new PickDrawer(shaper, lineCords.slice(20, lineCords.length - 10), years).drawPicks();
  return new ShipDrawer(shaper, lineCords, pickCords, canvas).downloadImage();

}).then(ship => {
  setTimeout(() => {
    ship.appearance();
  }, 700)
  //ship.appearance();
  // setTimeout(() => ship.move({x: 60, y: 250}), 500);
  // setTimeout(() => ship.smoothMove({x: 560, y: 250}), 1500)
});


