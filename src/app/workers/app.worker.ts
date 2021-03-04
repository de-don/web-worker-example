/// <reference lib="webworker" />

import { Subject, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { generateStatisticDto } from '../utils/common';
import { CommunicationMessage } from '../models/communication-message';
import { StatisticDto } from '../models/dtos/statistic.dto';
import { StatisticConfiguration } from '../models/statistic-configuration';
import { CommunicationCommand } from '../enums/communication-command';

/** Steam with messages from client */
const messages$ = new Subject<CommunicationMessage<unknown>>();

/** Steam with current configuration */
const configuration$ = messages$.pipe(
  filter(data => data.command === CommunicationCommand.SetConfig),
  map(data => data.payload as StatisticConfiguration),
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
    command: CommunicationCommand.NewItems,
    payload: items,
  };
  postMessage(message);
});
