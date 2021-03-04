/**
 * Generate random integer in [low, high]
 * @param low min value
 * @param high max value
 */
export function randomInt(low: number, high: number): number {
  return Math.floor(Math.random() * (high - low)) + low;
}
