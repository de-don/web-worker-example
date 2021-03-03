import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { CommunicationMessage } from '../models/communication-message';
import { WorkerConfiguration } from '../models/worker-configuration';
import { CommunicationCommand } from '../enums/communication-command';
import { StatisticDto } from '../models/dtos/statistic.dto';
import { Statistic } from '../models/statistic';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  /** List of worker messages */
  private workerMessages$ = new Subject<CommunicationMessage<unknown>>();

  private worker$ = new ReplaySubject<Worker>(1);

  /** List of statistics */
  public statistics$ = this.workerMessages$.pipe(
    filter(message => message.command === CommunicationCommand.NewItems),
    map((message: CommunicationMessage<StatisticDto[]>) => this.handleNewItemsMessage(message)),
  );

  constructor() {
    if (typeof Worker === 'undefined') {
      alert('Web Workers are not supported in this environment');
      return;
    }

    const worker = new Worker('../workers/app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      this.workerMessages$.next(data as CommunicationMessage<any>);
    };

    this.worker$.next(worker);
  }

  /** Set new configuration for worker */
  public setConfiguration(config: WorkerConfiguration): void {
    this.worker$.pipe(
      first(),
    ).subscribe((worker) => {
      const settingsMessage: CommunicationMessage<WorkerConfiguration> = {
        command: CommunicationCommand.SetConfig,
        payload: config,
      };
      worker.postMessage(settingsMessage);
    });
  }

  /** Handle new items message and convert dtos to models */
  private handleNewItemsMessage(message: CommunicationMessage<StatisticDto[]>): Statistic[] {
    const dtoItems = message.payload;
    const sliceLength = Math.max(dtoItems.length - 10, 0);
    const lastItems = dtoItems.slice(sliceLength);

    return plainToClass(Statistic, lastItems);
  }
}
