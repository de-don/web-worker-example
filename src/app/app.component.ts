import { Component } from '@angular/core';
import { StatisticDto } from './models/dtos/statistic.dto';
import { generateStatisticDto } from './utils/common';
import { Statistic } from './models/statistic';
import { plainToClass } from 'class-transformer';
import { StatisticChild } from './models/statistic-child';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public statistics: Statistic[];

  public statisticsData: StatisticDto[] = [
    generateStatisticDto(),
    generateStatisticDto(),
    generateStatisticDto(),
    generateStatisticDto(),
    generateStatisticDto(),
    generateStatisticDto(),
  ];

  constructor() {
    this.statistics = this.statisticsData.map((dto) => {
      const statisticChild = plainToClass(StatisticChild, dto.child); // to convert user plain object a single user. also supports arrays
      const statistic = plainToClass(Statistic, dto); // to convert user plain object a single user. also supports arrays
      statistic.child = statisticChild;
      console.log({ statistic });
      return statistic;
    });
  }

  /** Track By Statistic item */
  public trackByStatistic(index: number, stat: Statistic): string {
    return stat.id;
  }
}
