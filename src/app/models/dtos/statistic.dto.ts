import { StatisticChildDto } from './statistic-child.dto';

/**
 * Statistic DTO with child
 */
export interface StatisticDto {
  /** Id */
  id: string;

  /** Integer value */
  int: number;

  /** Float value */
  float: number;

  /** Hex Color */
  color: string;

  /** Statistic items */
  child: StatisticChildDto;
}
