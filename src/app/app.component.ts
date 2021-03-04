import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

import { StatisticConfiguration } from './models/statistic-configuration';
import { StatisticService } from './services/statistic.service';

const DEFAULT_DELAY = 1000;
const DEFAULT_ARRAY_SIZE = 10000;

/**
 * Main component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  /** Form for configuring */
  public readonly form = this.fb.group({
    delay: [DEFAULT_DELAY],
    arraySize: [DEFAULT_ARRAY_SIZE],
    ids: [''],
  });

  /** Current configuration */
  private readonly configuration$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    debounceTime(300),
    distinctUntilChanged<StatisticConfiguration>((a, b) => {
      return a.delay === b.delay && a.arraySize === b.arraySize;
    }),
    filter(config => config.delay >= 0 && config.arraySize >= 0),
  );

  /** Statistics to display */
  public readonly statistics$ = this.statisticService.statistics$.pipe(
    map((statistics) => {
      // Mutate ids only for new arrived data
      const ids = (this.form.value.ids || '').split(',');
      const arrayLength = statistics.length;
      return statistics.map((stat, index) => {
        const newId = ids[arrayLength - index - 1];
        if (!!newId) {
          stat.id = newId.trim();
        }
        return stat;
      });
    }),
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly statisticService: StatisticService,
  ) {
    this.configuration$.subscribe((config) => {
      this.statisticService.setConfiguration(config);
    });
  }
}
