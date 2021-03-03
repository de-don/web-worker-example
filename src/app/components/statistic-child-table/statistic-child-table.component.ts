import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StatisticChild } from '../../models/statistic-child';

/**
 * Statistic child table component
 */
@Component({
  selector: 'app-statistic-child-table',
  templateUrl: './statistic-child-table.component.html',
  styleUrls: ['./statistic-child-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticChildTableComponent {
  /** Statistic child item */
  @Input()
  public child!: StatisticChild;
}
