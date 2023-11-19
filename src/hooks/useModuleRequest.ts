import { useState } from 'react';
import RNYLEventEmitter from './..';

export const useModuleRequest = <T extends Partial<T>, U extends Partial<U>>(
  moduleName: string,
  eventName: string
): [
  (moduleName: string, eventName: string) => Promise<unknown>,
  { isLoading: boolean; data: T | null | undefined; error: U | null }
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<U | null>(null);

  const send = async (
    resolve: (data: T) => void,
    reject: (error: U) => void,
    data?: Object
  ) => {
    try {
      const res = await RNYLEventEmitter.sendEventToNative({
        eventName: eventName,
        target: moduleName,
        data: data,
      });
      setIsLoading(false);
      const parseResponse = JSON.parse(res);
      setData(parseResponse);
      resolve(parseResponse);
    } catch (e) {
      const result = e as U;
      setIsLoading(false);
      setError(result);
      reject(result);
    }
  };

  const requestToModule = async () =>
    new Promise((resolve, reject) => {
      setIsLoading(true);
      send(resolve, reject, {});
    });

  return [requestToModule, { isLoading: isLoading, data, error }];
};
