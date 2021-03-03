/// <reference lib="webworker" />

import { generateStatisticDto } from './utils/common';
import { Subject, timer } from 'rxjs';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { CommunicationMessage } from './models/communication-message';
import { StatisticDto } from './models/dtos/statistic.dto';
import { WorkerConfiguration } from './models/worker-configuration';

/** Steam with messages from client */
const messages$ = new Subject<CommunicationMessage<unknown>>();

/** Steam with current configuration */
const configuration$ = messages$.pipe(
  filter(data => data.command === 'set-settings'),
  map(data => data.payload as WorkerConfiguration),
);

const fakeSocketStream$ = configuration$.pipe(
  switchMap(({ delay, arraySize }) => {
    return timer(0, delay).pipe(
      map(() => {
        return new Array(arraySize).fill(0).map(() => generateStatisticDto());
      }),
    );
  }),
);

addEventListener('message', ({ data }) => {
  if (data.command && data.payload) {
    messages$.next(data);
  }
});

fakeSocketStream$.subscribe((items: StatisticDto[]) => {
  const message: CommunicationMessage<StatisticDto[]> = {
    command: 'new-items',
    payload: items,
  };
  postMessage(message);
});
