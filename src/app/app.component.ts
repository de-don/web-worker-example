import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { WorkerConfiguration } from './models/worker-configuration';
import { StatisticService } from './services/statistic.service';

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
  public form = this.fb.group({
    delay: [1000, Validators.required],
    arraySize: [1000, Validators.required],
    ids: [''],
  });

  /** Current configuration */
  private configuration$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    debounceTime(300),
    distinctUntilChanged<WorkerConfiguration>((a, b) => {
      return a.delay === b.delay && a.arraySize === b.arraySize;
    }),
  );

  /** Statistics to display */
  public statistics$ = this.statisticService.statistics$.pipe(
    map((statistics) => {
      // Mutate ids only for new arrived data
      const ids = (this.form.value.ids || '').split(',');
      return statistics.map((stat, index) => {
        const newId = ids[index];
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
