export interface ISendEventParams {
  eventName: string;
  target: string;
  timeout?: number;
  data?: Object;
  subscribe?: boolean;
}

export interface ISendEventResponse<T> {
  eventName: string;
  target: string;
  uuid: string;
  data?: T;
}
