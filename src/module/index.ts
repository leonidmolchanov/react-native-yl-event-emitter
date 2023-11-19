import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { ISendEventParams, ISendEventResponse } from './types';

const LINKING_ERROR =
  `The package 'react-native-yl-event-emitter' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';
const DEFAULT_TIMEOUT = 10;

const YlEventEmitter: {
  sendEventToNative: (
    eventName: string,
    target: string,
    timeout: number | undefined,
    data?: undefined | string
  ) => Promise<boolean>;
  setSupportedEvents: (args: string[]) => void;
  addSupportedEvents: (args: string[]) => void;
  responseByUUID: (uuid: string, data: string, error?: string) => void;
} = NativeModules.YlEventEmitter
  ? NativeModules.YlEventEmitter
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class RNYLEventEmitter {
  private instance: any;

  constructor() {
    this.instance = new NativeEventEmitter(NativeModules.YlEventEmitter);
  }

  private prepareData = (
    _: string,
    callback: (e: ISendEventResponse<unknown>) => void
  ) => {
    return (e: ISendEventResponse<string>) => {
      callback({
        ...e,
        data: e?.data && JSON.parse(e.data) ? JSON.parse(e.data) : e.data,
      });
    };
  };

  public addListener = (
    event: string,
    onData: (e: ISendEventResponse<unknown>) => void
  ) => {
    return this.instance.addListener(event, this.prepareData(event, onData));
  };

  public sendEventToNative(params: ISendEventParams): Promise<boolean> {
    const data = params?.data && JSON.stringify(params?.data);

    return YlEventEmitter.sendEventToNative(
      params.target,
      params.eventName,
      params?.timeout ? params?.timeout : DEFAULT_TIMEOUT,
      data
    );
  }
  public setSupportedEvents(args: string[]): void {
    return YlEventEmitter.setSupportedEvents(args);
  }
  public addSupportedEvents(args: string[]): void {
    return YlEventEmitter.addSupportedEvents(args);
  }
  public responseByUUID(uuid: string, data: Object, error?: string): void {
    return YlEventEmitter.responseByUUID(uuid, JSON.stringify(data), error);
  }
}

export const RNYLEventEmitterInstanse = new RNYLEventEmitter();
