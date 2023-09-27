import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { isJson } from './utils';

const LINKING_ERROR =
  `The package 'react-native-yl-event-emitter' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const YlEventEmitter: {
  sendEventToNative: (message: string) => Promise<boolean>;
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

  private prepareData = (event: string, callback: (e: any) => void) => {
    return (e: string) => {
      if (isJson(e) && event) {
        const data = JSON.parse(e);
        callback(data.payload);
      }
    };
  };

  public addListener = (event: string, onData: (e: any) => void) => {
    return this.instance.addListener(
      'YLModulesEvent',
      this.prepareData(event, onData)
    );
  };

  public sendEventToNative(message: string): Promise<boolean> {
    return YlEventEmitter.sendEventToNative(message);
  }
}
