import { Component } from '@angular/core';
import { Statistic } from './models/statistic';
import { plainToClass } from 'class-transformer';
import { StatisticChild } from './models/statistic-child';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public statistics: Statistic[] = [];

  constructor() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker('./app.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        if (data.command === 'new-items') {
          const dtoItems = data.payload;
          const last10Items = dtoItems.slice(Math.max(dtoItems.length - 10, 1));

          this.statistics = last10Items.map((dto) => {
            const statisticChild = plainToClass(StatisticChild, dto.child);
            const statistic = plainToClass(Statistic, dto);
            statistic.child = statisticChild;
            return statistic;
          });
        }
      };
      worker.postMessage({
        command: 'set-settings',
        payload: {
          delay: 100,
          arraySize: 1000,
        },
      });
    } else {
      alert('Web Workers are not supported in this environment');
    }
  }

  /** Track By Statistic item */
  public trackByStatistic(index: number, stat: Statistic): string {
    return stat.id;
  }
}
