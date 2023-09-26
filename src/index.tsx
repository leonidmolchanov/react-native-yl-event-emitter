import { NativeModules, Platform } from 'react-native';

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

export function sendEventToNative(message: string): Promise<boolean> {
  return YlEventEmitter.sendEventToNative(message);
}
