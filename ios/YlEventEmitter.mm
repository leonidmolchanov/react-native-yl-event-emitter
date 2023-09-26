#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>


@interface RCT_EXTERN_MODULE(YlEventEmitter, NSObject)

RCT_EXTERN_METHOD(sendEventToNative:(NSString)json
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
