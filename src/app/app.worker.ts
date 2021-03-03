/// <reference lib="webworker" />

import { StatisticDto } from './models/dtos/statistic.dto';
import { generateStatisticDto } from './utils/common';

let intervalId: any | null = null;


addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response);
  if (data.command === 'set-settings') {
    runGenerator(data.payload.delay, data.payload.arraySize);
  }
});

function runGenerator(delay: number, arraySize: number): void {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    const items = generateItems(arraySize);
    postMessage({
      command: 'new-items',
      payload: items,
    });
  }, delay);
}

function generateItems(arraySize): StatisticDto[] {
  return Array.apply(null, Array(arraySize)).map(generateStatisticDto);
}
