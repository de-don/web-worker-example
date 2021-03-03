import { ChangeDetectionStrategy, Component } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Statistic } from './models/statistic';
import { CommunicationMessage } from './models/communication-message';
import { StatisticDto } from './models/dtos/statistic.dto';
import { WorkerConfiguration } from './models/worker-configuration';
import { CommunicationCommand } from './enums/communication-command';

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

  /** List of worker messages */
  private workerMessages$ = new Subject<CommunicationMessage<unknown>>();

  /** List of statistics */
  public statistics$ = this.workerMessages$.pipe(
    filter(message => message.command === CommunicationCommand.NewItems),
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

    this.configuration$.subscribe((config) => {
      const settingsMessage: CommunicationMessage<WorkerConfiguration> = {
        command: CommunicationCommand.SetConfig,
        payload: config,
      };
      worker.postMessage(settingsMessage);
    });
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

    return plainToClass(Statistic, mutatedItems);
  }
}
