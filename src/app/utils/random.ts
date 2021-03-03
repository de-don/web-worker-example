import { v4 as _uuidv4 } from 'uuid';

/**
 * Generate random integer in [low, high]
 * @param low min value
 * @param high max value
 */
export function randomInt(low: number, high: number): number {
  return Math.floor(Math.random() * (high - low)) + low;
}

/** Generate uuid4 */
export function uuid4(): string {
  return _uuidv4();
}
