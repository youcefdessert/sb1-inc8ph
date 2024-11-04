import { Application } from '@nativescript/core';
import { registerElement } from '@nativescript/core';

// Register custom components
registerElement('TimeBlock', () => require('./components/time-block').TimeBlockComponent);
registerElement('ScheduleList', () => require('./components/schedule-list').ScheduleListComponent);

Application.run({ moduleName: 'app-root' });