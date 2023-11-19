#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>


@interface RCT_EXTERN_MODULE(YlEventEmitter, NSObject)

RCT_EXTERN_METHOD(setSupportedEvents:(NSArray *)args)
RCT_EXTERN_METHOD(addSupportedEvents:(NSArray *)args)
RCT_EXTERN_METHOD(responseByUUID:(NSString *)uuid
                  data:(NSString)data
                  error:(NSString *)error
                  )


RCT_EXTERN_METHOD(sendEventToNative:(NSString)target
                  eventName:(NSString *)eventName
                  timeout:(NSInteger)timeout
                  data:(NSString *)data
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
