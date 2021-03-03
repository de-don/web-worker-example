import { CommunicationCommand } from '../enums/communication-command';

/**
 * Interface for messages between Client <=> Worker
 */
export interface CommunicationMessage<T> {
  /** Command name */
  command: CommunicationCommand;

  /** Payload information */
  payload: T;
}
