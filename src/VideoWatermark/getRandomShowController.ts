import getRandom from '@js-toolkit/utils/getRandom';
import getTimer from '@js-toolkit/utils/getTimer';
import toInt from '@js-toolkit/utils/toInt';
import { getShowController, ShowController, ShowControllerOptions } from './getShowController';

export interface RandomShowControllerOptions {
  readonly updateTimeout?: number;
  readonly getBounds: () => Point;
  readonly onUpdate: (coord: Point) => void;
  readonly showOptions?: ShowControllerOptions;
}

export interface RandomShowController extends ShowController {
  readonly update: VoidFunction;
}

export function getRandomShowController({
  showOptions,
  updateTimeout,
  getBounds,
  onUpdate,
}: RandomShowControllerOptions): RandomShowController {
  const update = (): void => {
    const { x: maxX, y: maxY } = getBounds();
    onUpdate({
      x: getRandom(0, maxX),
      y: getRandom(0, maxY),
    });
  };

  if (showOptions) {
    const { visibleTimeout, hiddenTimeout, isVisible, onShow, onHide } = showOptions;

    const { start, stop } = getShowController({
      visibleTimeout,
      hiddenTimeout,
      isVisible,
      onShow: () => {
        update();
        onShow();
      },
      onHide,
    });

    return { start, stop, update };
  }

  const updateTimer = getTimer({
    callback: update,
    interval: () => updateTimeout ?? toInt(getRandom(5, 20) * 1000),
    autostart: false,
  });

  return {
    start: () => {
      update();
      updateTimer.start();
    },
    stop: updateTimer.stop,
    update,
  };
}
