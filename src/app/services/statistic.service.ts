import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticConfiguration } from '../models/statistic-configuration';
import { Statistic } from '../models/statistic';

/**
 * Abstract service for statistic
 */
@Injectable()
export abstract class StatisticService {
  /** List of statistics */
  public abstract readonly statistics$: Observable<Statistic[]>;

  /** Set new configuration for statistic generation */
  public abstract setConfiguration(config: StatisticConfiguration): void;
}
