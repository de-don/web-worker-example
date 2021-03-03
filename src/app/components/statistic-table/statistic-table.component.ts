import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Statistic } from '../../models/statistic';

/**
 * Component to render statistics table
 */
@Component({
  selector: 'app-statistic-table',
  templateUrl: './statistic-table.component.html',
  styleUrls: ['./statistic-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticTableComponent {
  /** Statistics */
  @Input()
  public statistics: Statistic[] = [];

  /** Track By Statistic item */
  public trackByStatistic(index: number, stat: Statistic): string {
    return stat.id;
  }
}

