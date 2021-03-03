import { StatisticDto } from '../models/dtos/statistic.dto';
import { randomInt } from './random';
import randomcolor from 'randomcolor';

const POW_10_9 = Math.pow(10, 9);
const POW_10_18 = Math.pow(10, 18);


export function generateStatisticDto(): StatisticDto {
  return {
    id: randomInt(0, 1000).toString(),
    int: randomInt(0, POW_10_9),
    // TODO(Dontsov): BIG NUMBERS
    float: randomInt(0, POW_10_18) / POW_10_9,
    color: randomcolor(),
    child: {
      id: randomInt(0, 1000).toString(),
      color: randomcolor(),
    },
  };
}
