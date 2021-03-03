import { Component } from '@angular/core';
import { Statistic } from './models/statistic';
import { plainToClass } from 'class-transformer';
import { StatisticChild } from './models/statistic-child';
import { CommunicationMessage } from './models/communication-message';
import { StatisticDto } from './models/dtos/statistic.dto';
import { WorkerConfiguration } from './models/worker-configuration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /** List of items to render */
  public statistics: Statistic[] = [];

  constructor() {
    if (typeof Worker === 'undefined') {
      alert('Web Workers are not supported in this environment');
      return;
    }

    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      const message = data as CommunicationMessage<any>;
      if (message.command === 'new-items') {
        this.handleNewItemsMessage(message as CommunicationMessage<StatisticDto[]>);
      }
    };

    const settingsMessage: CommunicationMessage<WorkerConfiguration> = {
      command: 'set-settings',
      payload: {
        delay: 100,
        arraySize: 1000,
      },
    };
    worker.postMessage(settingsMessage);
  }

  /** Track By Statistic item */
  public trackByStatistic(index: number, stat: Statistic): string {
    return stat.id;
  }

  /** Track By Statistic item */
  public handleNewItemsMessage(message: CommunicationMessage<StatisticDto[]>): void {
    const dtoItems = message.payload;
    const last10Items = dtoItems.slice(Math.max(dtoItems.length - 10, 1));

    this.statistics = last10Items.map((dto) => {
      // TODO(Dontsov): Optimize
      const statisticChild = plainToClass(StatisticChild, dto.child);
      const statistic = plainToClass(Statistic, dto);
      statistic.child = statisticChild;
      return statistic;
    });
  }
}
