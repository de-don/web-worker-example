/**
 * Interface for messages between Client <=> Worker
 */
export interface CommunicationMessage<T> {
  /** Command name */
  command: string;

  /** Payload information */
  payload: T;
}
