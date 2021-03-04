import randomcolor from 'randomcolor';

import { StatisticDto } from '../models/dtos/statistic.dto';
import { randomInt } from './random';

const POW_10_9 = Math.pow(10, 9);

const randomId = () => randomInt(0, POW_10_9).toString(16);

/** Generate random statistic DTO */
export function generateStatisticDto(): StatisticDto {
  return {
    id: randomId(),
    int: randomInt(0, POW_10_9),
    float: Math.random(),
    color: randomcolor(),
    child: {
      id: randomId(),
      color: randomcolor(),
    },
  };
}
