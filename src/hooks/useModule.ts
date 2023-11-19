import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import RNYLEventEmitter from './..';
import { ISendEventResponse } from '../module/types';

export const useModule = <T extends Partial<T>, U extends Partial<U>>(
  moduleName: string,
  eventName?: string,
  autoResponse: boolean = true,
  subscribe?: boolean
): {
  data: T | null | undefined;
  error: U | null;
  response: (data: string) => void;
} => {
  const emitter = useRef<typeof RNYLEventEmitter | null>(null);
  const [data, setData] = useState<T | null | undefined>(null);
  const [error, setError] = useState<U | null>(null);
  const [lastUUID, setLastUUID] = useState<string | null>(null);
  const response = (data: string) => {
    if (lastUUID) {
      RNYLEventEmitter.responseByUUID(lastUUID, data);
    }
  };

  useLayoutEffect(() => {
    RNYLEventEmitter.addSupportedEvents([moduleName]);
  }, [moduleName]);
  useEffect(() => {
    emitter.current = RNYLEventEmitter.addListener(
      moduleName,

      // @ts-ignore
      (data: ISendEventResponse<T>) => {
        if (eventName && eventName !== data.eventName) {
          return;
        }
        if (subscribe) {
          setData(data.data);
        }
        if (data.uuid) {
          setData(data.data);
          if (autoResponse) {
            RNYLEventEmitter.responseByUUID(data.uuid, { success: true });
          }
          setLastUUID(data.uuid);
        } else {
          setError(null);
        }
      }
    );
    // return () => emitter?.current?.remove();
  }, [autoResponse, eventName, moduleName, subscribe]);

  return { data, error, response };
};
