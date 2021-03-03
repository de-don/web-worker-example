import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Statistic } from '../../models/statistic';

/**
 * Statistic row component
 */
@Component({
  selector: 'app-statistic-row',
  templateUrl: './statistic-row.component.html',
  styleUrls: ['./statistic-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticRowComponent {
  /** Statistic item */
  @Input()
  public statistic!: Statistic;
}
