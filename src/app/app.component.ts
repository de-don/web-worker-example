import { Component } from '@angular/core';
import { Statistic } from './models/statistic';
import { plainToClass } from 'class-transformer';
import { StatisticChild } from './models/statistic-child';
import { CommunicationMessage } from './models/communication-message';
import { StatisticDto } from './models/dtos/statistic.dto';
import { WorkerConfiguration } from './models/worker-configuration';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /** Form for configuring */
  public form = this.fb.group({
    delay: [1000, Validators.required],
    arraySize: [1000, Validators.required],
    ids: [''],
  });

  /** List of worker messages */
  private workerMessages$ = new Subject<CommunicationMessage<unknown>>();

  /** List of statistics */
  public statistics$ = this.workerMessages$.pipe(
    filter(message => message.command === 'new-items'),
    map((message: CommunicationMessage<StatisticDto[]>) => this.handleNewItemsMessage(message)),
  );

  /** Current configuration */
  private configuration$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    debounceTime(300),
    distinctUntilChanged<WorkerConfiguration>((a, b) => {
      return a.delay === b.delay && a.arraySize === b.arraySize;
    }),
  );

  constructor(
    private readonly fb: FormBuilder,
  ) {
    if (typeof Worker === 'undefined') {
      alert('Web Workers are not supported in this environment');
      return;
    }

    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      this.workerMessages$.next(data as CommunicationMessage<any>);
    };

    // TODO(Dontsov): Unsubscribe
    this.configuration$.subscribe((config) => {
      const settingsMessage: CommunicationMessage<WorkerConfiguration> = {
        command: 'set-settings',
        payload: config,
      };
      worker.postMessage(settingsMessage);
    });
  }

  /** Track By Statistic item */
  public trackByStatistic(index: number, stat: Statistic): string {
    return stat.id;
  }

  /** Track By Statistic item */
  public handleNewItemsMessage(message: CommunicationMessage<StatisticDto[]>): Statistic[] {
    const dtoItems = message.payload;
    const sliceLength = Math.max(dtoItems.length - 10, 0);
    const lastItems = dtoItems.slice(sliceLength);

    // Mutate ids
    const ids = (this.form.value.ids || '').split(',');
    const mutatedItems = lastItems.map((stat, index) => {
      const newId = ids[index];
      if (!!newId) {
        stat.id = newId.trim();
      }
      return stat;
    });

    return mutatedItems.map((dto) => {
      // TODO(Dontsov): Optimize
      const statisticChild = plainToClass(StatisticChild, dto.child);
      const statistic = plainToClass(Statistic, dto);
      statistic.child = statisticChild;
      return statistic;
    });
  }
}
