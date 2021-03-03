import { StatisticChild } from './statistic-child';

/**
 * Statistic with statistic child
 */
export class Statistic {
  /** Id */
  public id: string;

  /** Integer value */
  public int: number;

  /** Float value */
  public float: number;

  /** Hex Color */
  public color: string;

  /** Statistic items */
  public child: StatisticChild;
}
