import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Drag-n-drop appointment after resize (T835545)`
  .page(url(__dirname, '../../container.html'));

['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => test(
  `After drag-n-drop appointment, size of appointment shouldn't change in the '${view}' view`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { element, resizableHandle } = scheduler.getAppointment('app');

    const initSize = {
      width: await element.clientWidth,
      height: await element.clientHeight,
    };

    const isVertical = await resizableHandle.bottom.count !== 0;

    await t
      .drag(isVertical ? resizableHandle.bottom : resizableHandle.right, 50, 50);

    const size = isVertical ? await element.clientHeight : await element.clientWidth;
    await t.expect(size)
      .gt(isVertical ? initSize.height : initSize.width);

    const sizeBeforeDrag = {
      width: await element.clientWidth,
      height: await element.clientHeight,
    };
    const positionBeforeDrag = {
      left: await element.clientLeft,
      top: await element.clientTop,
    };

    await t
      .drag(element, 10, 10, {
        offsetX: 0,
        offsetY: 0,
      });

    const elementClientWidth = await element.clientWidth;
    const elementClientHeight = await element.clientHeight;

    const elementClientLeft = await element.clientLeft;
    const elementClientTop = await element.clientTop;

    await t
      .expect(sizeBeforeDrag.width)
      .eql(elementClientWidth)

      .expect(sizeBeforeDrag.height)
      .eql(elementClientHeight)

      .expect(positionBeforeDrag.left)
      .eql(elementClientLeft)

      .expect(positionBeforeDrag.top)
      .eql(elementClientTop);
  },
).before(async () => createScheduler({
  views: [view],
  currentView: view,
  startDayHour: 9,
  currentDate: new Date(2017, 4, 1),
  dataSource: [{
    text: 'app',
    startDate: new Date(2017, 4, 1, 9, 0),
    endDate: new Date(2017, 4, 1, 10, 0),
  }],
})));
