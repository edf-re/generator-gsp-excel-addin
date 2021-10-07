/* eslint-disable no-unused-vars */

export enum DomainEvents {
  Error,
  SuccessfulExport,
  ClearMessages,
}

export type DomainEventMessage = {
  event: DomainEvents;
  message: string;
};

export class DomainEventMessenger {
  sendEvent(eventMessage: DomainEventMessage) {
    this.subscriber(eventMessage);
  }

  private subscriber: (event: DomainEventMessage) => void;

  subscribe(subscriber: (event: DomainEventMessage) => void) {
    this.subscriber = subscriber;
  }
}

let domainMessenger: DomainEventMessenger = null;

export function getDomainEventMessenger() {
  if (domainMessenger === null) {
    domainMessenger = new DomainEventMessenger();
  }
  return domainMessenger;
}

export function sendGlobalEvent(domainEventMessage: DomainEventMessage) {
  const msgr = getDomainEventMessenger();
  msgr.sendEvent(domainEventMessage);
}
