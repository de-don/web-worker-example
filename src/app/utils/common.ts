import randomcolor from 'randomcolor';

import { StatisticDto } from '../models/dtos/statistic.dto';
import { randomInt, uuid4 } from './random';

const POW_10_9 = Math.pow(10, 9);
const POW_10_18 = Math.pow(10, 18);

const randomId = () => uuid4().split('-')[0];

/** Generate random statistic DTO */
export function generateStatisticDto(): StatisticDto {
  return {
    id: randomId(),
    int: randomInt(0, POW_10_9),
    // TODO(Dontsov): BIG NUMBERS
    float: randomInt(0, POW_10_18) / POW_10_9,
    color: randomcolor(),
    child: {
      id: randomId(),
      color: randomcolor(),
    },
  };
}
